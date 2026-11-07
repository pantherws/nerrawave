"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { TaskView } from "@/components/task-view"
import { useMockAuth } from "@/components/mock-auth-provider"
import { withLegacyTaskFields, type TranslationTask } from "@/lib/mock-data"

export default function TaskPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { tasks, isReady } = useMockAuth()
  const [task, setTask] = useState<TranslationTask | null>(null)

  useEffect(() => {
    if (!isReady) return
    const id = params?.id
    if (!id) return

    const found = tasks.find((item) => item.id === id) ?? null
    setTask(found ? withLegacyTaskFields(found) : null)
    if (!found) router.replace("/")
  }, [isReady, params?.id, router, tasks])

  if (!isReady || !task) {
    return (
      <div className="flex h-full min-h-[50vh] items-center justify-center text-[15px] leading-[1.85] text-muted-foreground">
        Loading task…
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <TaskView task={task} />
    </div>
  )
}
