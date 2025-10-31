"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LearningLog {
  id: string
  title: string
  description: string
  skills_learned: string[]
  duration_hours: number
  log_date: string
  category: string
  created_at: string
}

interface LearningLogListProps {
  logs: LearningLog[]
}

export function LearningLogList({ logs }: LearningLogListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.skills_learned.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = categoryFilter === "all" || log.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  if (logs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Learning Logs</CardTitle>
          <CardDescription>Start tracking your learning journey</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/learning/create">
            <Button>Create Your First Learning Log</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Search</label>
              <Input
                placeholder="Search by title, skills, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="soft-skills">Soft Skills</SelectItem>
                  <SelectItem value="management">Management</SelectItem>
                  <SelectItem value="certification">Certification</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredLogs.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">No learning logs match your search criteria</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {filteredLogs.map((log) => (
            <Card key={log.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{log.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {new Date(log.log_date).toLocaleDateString()} • {log.duration_hours}h
                    </CardDescription>
                  </div>
                  <Link href={`/learning/${log.id}`}>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {log.description && <p className="text-sm text-muted-foreground line-clamp-2">{log.description}</p>}
                <div className="flex flex-wrap gap-2">
                  {log.category && <Badge variant="secondary">{log.category}</Badge>}
                  {log.skills_learned &&
                    log.skills_learned.length > 0 &&
                    log.skills_learned.slice(0, 3).map((skill, idx) => (
                      <Badge key={idx} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  {log.skills_learned && log.skills_learned.length > 3 && (
                    <Badge variant="outline">+{log.skills_learned.length - 3} more</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="text-xs text-muted-foreground text-right">
            Showing {filteredLogs.length} of {logs.length} logs
          </div>
        </>
      )}
    </div>
  )
}
