export interface DatabaseSchema {
  contracted_modules: string[]
  last_route: string
  collaborators_data: any
  companies_data: any
  whatsapp_config: any
}

class MockDatabase {
  private delay = 150 // Simulate network latency

  async get<K extends keyof DatabaseSchema>(key: K): Promise<DatabaseSchema[K] | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const data = localStorage.getItem(`nexus_db_${key}`)
          resolve(data ? JSON.parse(data) : null)
        } catch (e) {
          console.error('DB Read Error:', e)
          resolve(null)
        }
      }, this.delay)
    })
  }

  async set<K extends keyof DatabaseSchema>(key: K, value: DatabaseSchema[K]): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          localStorage.setItem(`nexus_db_${key}`, JSON.stringify(value))
          resolve(true)
        } catch (e) {
          console.error('DB Write Error:', e)
          resolve(false)
        }
      }, this.delay)
    })
  }
}

export const db = new MockDatabase()
