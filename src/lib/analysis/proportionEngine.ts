import type { DiamondProfile } from '@/types/inspection'
import type { ProportionFinding } from '@/types/report'
import { getRulesForShape, evaluateInRange } from './proportionRules'

export interface ProportionAnalysisResult {
  findings: ProportionFinding[]
  recommendation: 'pass' | 'review' | 'fail'
  confidence: number
}

export function analyzeProportions(diamond: DiamondProfile): ProportionAnalysisResult {
  const findings: ProportionFinding[] = []
  const rules = getRulesForShape(diamond.shape)

  if (!rules) {
    return {
      findings: [{ field: 'Shape', value: diamond.shape, status: 'fair', note: 'No rules available for this shape.' }],
      recommendation: 'review',
      confidence: 50,
    }
  }

  // Table percent
  if (diamond.tablePercent !== undefined) {
    const status = evaluateInRange(diamond.tablePercent, rules.table)
    findings.push({
      field: 'Table %',
      value: diamond.tablePercent,
      status,
      note: buildNote('Table', diamond.tablePercent, rules.table, status),
    })
  }

  // Depth percent
  if (diamond.depthPercent !== undefined) {
    const status = evaluateInRange(diamond.depthPercent, rules.depth)
    findings.push({
      field: 'Depth %',
      value: diamond.depthPercent,
      status,
      note: buildNote('Depth', diamond.depthPercent, rules.depth, status),
    })
  }

  // Length-to-width ratio
  if (diamond.length && diamond.width && diamond.width > 0) {
    const lw = Math.round((diamond.length / diamond.width) * 100) / 100
    const { min, max } = rules.lengthToWidth
    let status: ProportionFinding['status'] = 'excellent'
    let note = `L/W ratio ${lw} is within ideal range (${min}–${max}).`
    if (lw < min * 0.95 || lw > max * 1.05) {
      status = 'poor'
      note = `L/W ratio ${lw} is outside acceptable range (${min}–${max}).`
    } else if (lw < min || lw > max) {
      status = 'fair'
      note = `L/W ratio ${lw} is slightly outside ideal range (${min}–${max}).`
    } else if (lw < min * 1.02 || lw > max * 0.98) {
      status = 'good'
      note = `L/W ratio ${lw} is within good range.`
    }
    findings.push({ field: rules.lengthToWidth.label, value: lw, status, note })
  }

  // Polish
  if (diamond.polish) {
    const polishStatus = gradeToStatus(diamond.polish)
    findings.push({
      field: 'Polish',
      value: diamond.polish,
      status: polishStatus,
      note: `Polish grade: ${diamond.polish}.`,
    })
  }

  // Symmetry
  if (diamond.symmetry) {
    const symStatus = gradeToStatus(diamond.symmetry)
    findings.push({
      field: 'Symmetry',
      value: diamond.symmetry,
      status: symStatus,
      note: `Symmetry grade: ${diamond.symmetry}.`,
    })
  }

  const poorCount = findings.filter(f => f.status === 'poor').length
  const fairCount = findings.filter(f => f.status === 'fair').length

  let recommendation: 'pass' | 'review' | 'fail' = 'pass'
  if (poorCount >= 2) recommendation = 'fail'
  else if (poorCount >= 1 || fairCount >= 2) recommendation = 'review'

  const confidence = Math.max(55, 100 - poorCount * 15 - fairCount * 8)

  return { findings, recommendation, confidence }
}

function buildNote(
  label: string,
  value: number,
  threshold: { excellent: [number, number]; good: [number, number]; fair: [number, number] },
  status: string
): string {
  const [eMin, eMax] = threshold.excellent
  if (status === 'excellent') return `${label} ${value}% is in the excellent range (${eMin}–${eMax}%).`
  if (status === 'good') return `${label} ${value}% is within good range.`
  if (status === 'fair') return `${label} ${value}% is at the edge of acceptable range.`
  return `${label} ${value}% is outside recommended range (ideal: ${eMin}–${eMax}%).`
}

function gradeToStatus(grade: string): ProportionFinding['status'] {
  if (grade === 'Excellent') return 'excellent'
  if (grade === 'Very Good') return 'good'
  if (grade === 'Good') return 'fair'
  return 'poor'
}
