import type { SymmetryAnalysis } from '@/types/symmetry'

interface Props {
  analysis: SymmetryAnalysis
}

const interpretationColor: Record<string, string> = {
  Excellent: 'text-green-600 dark:text-green-400',
  'Very Good': 'text-gem-600 dark:text-gem-400',
  Good: 'text-blue-600 dark:text-blue-400',
  Fair: 'text-yellow-600 dark:text-yellow-400',
  Poor: 'text-red-600 dark:text-red-400',
}

function SubScoreRow({ label, score }: { label: string; score: number }) {
  const color = score >= 85 ? 'bg-green-500' : score >= 70 ? 'bg-gem-500' : score >= 55 ? 'bg-yellow-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-500 dark:text-slate-400 w-36 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-mono text-slate-700 dark:text-slate-300 w-8 text-right">{score}</span>
    </div>
  )
}

export default function ScorePanel({ analysis }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-end gap-3">
        <span className="text-5xl font-bold text-slate-900 dark:text-slate-100">{analysis.overallScore}</span>
        <div className="pb-1">
          <span className={`text-lg font-semibold ${interpretationColor[analysis.interpretation] ?? 'text-slate-600'}`}>
            {analysis.interpretation}
          </span>
          <p className="text-xs text-slate-400">/ 100</p>
        </div>
      </div>

      <div className="space-y-2.5">
        <SubScoreRow label="Axis alignment" score={analysis.subScores.axisAlignment} />
        <SubScoreRow label="Outline balance" score={analysis.subScores.outlineBalance} />
        <SubScoreRow label="Tip/corner balance" score={analysis.subScores.tipCornerBalance} />
        <SubScoreRow label="Table centering" score={analysis.subScores.tableCentering} />
      </div>

      {analysis.manualNotes && (
        <p className="text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-3">
          {analysis.manualNotes}
        </p>
      )}
    </div>
  )
}
