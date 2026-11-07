"use client"

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react"
import {
  createMockTask,
  createMockUser,
  type CreateTaskEnhancements,
  loadTasks,
  loadUser,
  saveTasks,
  saveUser,
  withLegacyTaskFields,
  type MockUser,
  type TranslationTask,
} from "@/lib/mock-data"

interface AuthContextValue {
  user: MockUser | null
  tasks: TranslationTask[]
  isReady: boolean
  login: (email: string) => void
  logout: () => void
  createTask: (
    fileName: string,
    sourceLanguage: string,
    targetLanguage: string,
    enhancements?: CreateTaskEnhancements,
  ) => TranslationTask
  updateTask: (id: string, patch: Partial<TranslationTask>) => void
  deleteTask: (id: string) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null)
  const [tasks, setTasks] = useState<TranslationTask[]>([])
  const [isReady, setIsReady] = useState(false)

  useLayoutEffect(() => {
    setUser(loadUser())
    setTasks(loadTasks().map(withLegacyTaskFields))
    setIsReady(true)
  }, [])

  const login = useCallback((email: string) => {
    const nextUser = createMockUser(email)
    setUser(nextUser)
    saveUser(nextUser)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    saveUser(null)
  }, [])

  const createTask = useCallback(
    (
      fileName: string,
      sourceLanguage: string,
      targetLanguage: string,
      enhancements?: CreateTaskEnhancements,
    ) => {
      const task = createMockTask(fileName, sourceLanguage, targetLanguage, enhancements)
      setTasks((prev) => {
        const next = [task, ...prev]
        saveTasks(next)
        return next
      })
      return task
    },
    [],
  )

  const updateTask = useCallback((id: string, patch: Partial<TranslationTask>) => {
    setTasks((prev) => {
      const next = prev.map((task) => (task.id === id ? { ...task, ...patch } : task))
      saveTasks(next)
      return next
    })
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => {
      const next = prev.filter((task) => task.id !== id)
      saveTasks(next)
      return next
    })
  }, [])

  const value = useMemo(
    () => ({ user, tasks, isReady, login, logout, createTask, updateTask, deleteTask }),
    [user, tasks, isReady, login, logout, createTask, updateTask, deleteTask],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useMockAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useMockAuth must be used within MockAuthProvider")
  }
  return context
}
