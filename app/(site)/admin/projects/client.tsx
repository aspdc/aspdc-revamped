'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import { projectSchema } from '@/lib/admin-schemas'
import type { Project } from '@/db/types'
import { addProject, updateProject, deleteProject } from '@/db/mutations'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProjectsAdminClientProps {
    initialData: Project[]
}

export default function ProjectsAdminClient({
    initialData,
}: ProjectsAdminClientProps) {
    const router = useRouter()
    const [projects, setProjects] = useState(initialData)

    // Update state when initialData changes (after router.refresh())
    useEffect(() => {
        setProjects(initialData)
    }, [initialData])
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        author: '',
        description: '',
        liveLink: '',
        githubUrl: '',
        projectBannerUrl: '',
    })

    const resetForm = () => {
        setFormData({
            name: '',
            author: '',
            description: '',
            liveLink: '',
            githubUrl: '',
            projectBannerUrl: '',
        })
        setEditingId(null)
    }

    const handleEdit = (project: Project) => {
        setFormData({
            name: project.name,
            author: project.author,
            description: project.description,
            liveLink: project.liveLink || '',
            githubUrl: project.githubUrl || '',
            projectBannerUrl: project.projectBannerUrl || '',
        })
        setEditingId(project.id)
        setIsCreateOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const validated = projectSchema.parse({
                ...formData,
                liveLink: formData.liveLink || undefined,
                githubUrl: formData.githubUrl || undefined,
                projectBannerUrl: formData.projectBannerUrl || undefined,
            })

            const dataToSubmit = {
                ...validated,
                liveLink: validated.liveLink || null,
                githubUrl: validated.githubUrl || null,
                projectBannerUrl: validated.projectBannerUrl || null,
            }

            if (editingId) {
                await updateProject(editingId, dataToSubmit)
                toast.success('Project updated successfully')
            } else {
                await addProject(dataToSubmit)
                toast.success('Project created successfully')
            }

            router.refresh()
            resetForm()
            setIsCreateOpen(false)
        } catch (error) {
            if (error instanceof Error && error.name === 'ZodError') {
                toast.error('Validation failed. Please check your inputs.')
            } else {
                toast.error(
                    editingId
                        ? 'Failed to update project'
                        : 'Failed to create project'
                )
            }
            console.error('Error:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) {
            return
        }

        try {
            await deleteProject(id)
            toast.success('Project deleted successfully')
            router.refresh()
        } catch (error) {
            toast.error('Failed to delete project')
            console.error('Error:', error)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Projects</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage projects and showcases
                    </p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>Add Project</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>
                                {editingId ? 'Edit' : 'Create'} Project
                            </DialogTitle>
                            <DialogDescription>
                                {editingId
                                    ? 'Update the project details'
                                    : 'Add a new project to the system'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="author">Author *</Label>
                                <Input
                                    id="author"
                                    value={formData.author}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            author: e.target.value,
                                        })
                                    }
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">
                                    Description *
                                </Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                    required
                                    disabled={isSubmitting}
                                    rows={4}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="liveLink">Live Link</Label>
                                <Input
                                    id="liveLink"
                                    type="url"
                                    value={formData.liveLink}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            liveLink: e.target.value,
                                        })
                                    }
                                    placeholder="https://example.com"
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="githubUrl">GitHub URL</Label>
                                <Input
                                    id="githubUrl"
                                    type="url"
                                    value={formData.githubUrl}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            githubUrl: e.target.value,
                                        })
                                    }
                                    placeholder="https://github.com/user/repo"
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="projectBannerUrl">
                                    Project Banner URL
                                </Label>
                                <Input
                                    id="projectBannerUrl"
                                    type="url"
                                    value={formData.projectBannerUrl}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            projectBannerUrl: e.target.value,
                                        })
                                    }
                                    placeholder="https://example.com/banner.jpg"
                                    disabled={isSubmitting}
                                />
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        resetForm()
                                        setIsCreateOpen(false)
                                    }}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting
                                        ? 'Saving...'
                                        : editingId
                                          ? 'Update'
                                          : 'Create'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {projects.length === 0 ? (
                <div className="text-muted-foreground py-12 text-center">
                    No projects found. Create one to get started.
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {projects.map((project) => (
                                <TableRow key={project.id}>
                                    <TableCell className="font-medium">
                                        {project.name}
                                    </TableCell>
                                    <TableCell>{project.author}</TableCell>
                                    <TableCell className="max-w-md truncate">
                                        {project.description}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleEdit(project)
                                                }
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() =>
                                                    handleDelete(project.id)
                                                }
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    )
}
