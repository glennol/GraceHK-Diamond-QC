import { openDB, type IDBPDatabase } from 'idb'

export interface DiamondQCDB {
  inspections: { key: string; value: any }
  assets: { key: string; value: any; indexes: { byInspection: string } }
  ocrResults: { key: string; value: any; indexes: { byInspection: string } }
  clarityAnnotations: { key: string; value: any; indexes: { byInspection: string } }
  symmetryAnalyses: { key: string; value: any; indexes: { byInspection: string } }
  certExtractions: { key: string; value: any; indexes: { byInspection: string } }
  reports: { key: string; value: any; indexes: { byInspection: string } }
  settings: { key: string; value: any }
}

let dbInstance: IDBPDatabase<DiamondQCDB> | null = null

export async function getDb(): Promise<IDBPDatabase<DiamondQCDB>> {
  if (dbInstance) return dbInstance
  dbInstance = await openDB<DiamondQCDB>('diamond-qc', 1, {
    upgrade(db) {
      db.createObjectStore('inspections', { keyPath: 'id' })
      const assets = db.createObjectStore('assets', { keyPath: 'id' })
      assets.createIndex('byInspection', 'inspectionId')
      const ocr = db.createObjectStore('ocrResults', { keyPath: 'id' })
      ocr.createIndex('byInspection', 'inspectionId')
      const clarity = db.createObjectStore('clarityAnnotations', { keyPath: 'id' })
      clarity.createIndex('byInspection', 'inspectionId')
      const sym = db.createObjectStore('symmetryAnalyses', { keyPath: 'id' })
      sym.createIndex('byInspection', 'inspectionId')
      const cert = db.createObjectStore('certExtractions', { keyPath: 'id' })
      cert.createIndex('byInspection', 'inspectionId')
      const reports = db.createObjectStore('reports', { keyPath: 'id' })
      reports.createIndex('byInspection', 'inspectionId')
      db.createObjectStore('settings', { keyPath: 'key' })
    },
  })
  return dbInstance
}
