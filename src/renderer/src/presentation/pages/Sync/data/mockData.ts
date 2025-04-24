export interface SyncVersion {
  version: string
  created_at: string
  size: number // in bytes
  status: 'success' | 'pending' | 'failed'
  device: string
  type: 'auto' | 'manual'
}

export const syncVersions: SyncVersion[] = [
  {
    version: 'v1.0.5',
    created_at: '2025-04-24T08:30:00Z',
    size: 1024 * 1024 * 2.5, // 2.5MB
    status: 'success',
    device: 'Desktop App',
    type: 'manual'
  },
  {
    version: 'v1.0.4',
    created_at: '2025-04-23T15:45:00Z',
    size: 1024 * 1024 * 2.1, // 2.1MB
    status: 'success',
    device: 'Mobile App',
    type: 'auto'
  },
  {
    version: 'v1.0.3',
    created_at: '2025-04-22T10:15:00Z',
    size: 1024 * 1024 * 2.3, // 2.3MB
    status: 'success',
    device: 'Desktop App',
    type: 'manual'
  },
  {
    version: 'v1.0.2',
    created_at: '2025-04-21T09:20:00Z',
    size: 1024 * 1024 * 1.8, // 1.8MB
    status: 'failed',
    device: 'Mobile App',
    type: 'auto'
  },
  {
    version: 'v1.0.1',
    created_at: '2025-04-20T14:10:00Z',
    size: 1024 * 1024 * 2.0, // 2.0MB
    status: 'success',
    device: 'Desktop App',
    type: 'manual'
  }
]

export const syncStats = {
  lastSync: '2025-04-24T08:30:00Z',
  totalSyncs: 15,
  totalDataSynced: 1024 * 1024 * 35, // 35MB
  autoSyncs: 8,
  manualSyncs: 7,
  successRate: 93.3 // percentage
}