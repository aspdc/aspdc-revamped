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
import { achievementSchema } from '@/lib/admin-schemas'
import type { Achievement } from '@/db/types'
import {
    addAchievement,
    updateAchievement,
    deleteAchievement,
} from '@/db/mutations'
import { useRouter } from 'next/navigation'
import { formatDate } from '@/lib/date-utils'
import { useEffect } from 'react'

interface AchievementsAdminClientProps {
    initialData: Achievement[]
}

export default function AchievementsAdminClient({
    initialData,
}: AchievementsAdminClientProps) {
    const router = useRouter()
    const [achievements, setAchievements] = useState(initialData)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Update state when initialData changes (after router.refresh())
    useEffect(() => {
        setAchievements(initialData)
    }, [initialData])

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        imageUrl: '',
    })

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            date: '',
            imageUrl: '',
        })
        setEditingId(null)
    }

    const handleEdit = (achievement: Achievement) => {
        setFormData({
            title: achievement.title,
            description: achievement.description,
            date:
                achievement.date instanceof Date
                    ? achievement.date.toISOString().split('T')[0]
                    : achievement.date,
            imageUrl: achievement.imageUrl || '',
        })
        setEditingId(achievement.id)
        setIsCreateOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const validated = achievementSchema.parse({
                ...formData,
                imageUrl: formData.imageUrl || undefined,
            })

            // Convert date string to Date object
            const dataToSubmit = {
                ...validated,
                date: new Date(validated.date),
                imageUrl: validated.imageUrl || null,
            }

            if (editingId) {
                await updateAchievement(editingId, dataToSubmit)
                toast.success('Achievement updated successfully')
            } else {
                await addAchievement(dataToSubmit)
                toast.success('Achievement created successfully')
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
                        ? 'Failed to update achievement'
                        : 'Failed to create achievement'
                )
            }
            console.error('Error:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this achievement?')) {
            return
        }

        try {
            await deleteAchievement(id)
            toast.success('Achievement deleted successfully')
            router.refresh()
        } catch (error) {
            toast.error('Failed to delete achievement')
            console.error('Error:', error)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Achievements</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage achievements and accomplishments
                    </p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>Add Achievement</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingId ? 'Edit' : 'Create'} Achievement
                            </DialogTitle>
                            <DialogDescription>
                                {editingId
                                    ? 'Update the achievement details'
                                    : 'Add a new achievement to the system'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            title: e.target.value,
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
                                <Label htmlFor="date">Date *</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            date: e.target.value,
                                        })
                                    }
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="imageUrl">Image URL</Label>
                                <Input
                                    id="imageUrl"
                                    type="url"
                                    value={formData.imageUrl}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            imageUrl: e.target.value,
                                        })
                                    }
                                    placeholder="https://example.com/image.jpg"
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

            {achievements.length === 0 ? (
                <div className="text-muted-foreground py-12 text-center">
                    No achievements found. Create one to get started.
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {achievements.map((achievement) => (
                                <TableRow key={achievement.id}>
                                    <TableCell className="font-medium">
                                        {achievement.title}
                                    </TableCell>
                                    <TableCell className="max-w-md truncate">
                                        {achievement.description}
                                    </TableCell>
                                    <TableCell>
                                        {formatDate(achievement.date)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleEdit(achievement)
                                                }
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() =>
                                                    handleDelete(achievement.id)
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
