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
import { upcomingEventSchema } from '@/lib/admin-schemas'
import type { UpcomingEvent } from '@/db/types'
import {
    addUpcomingEvent,
    updateUpcomingEvent,
    deleteUpcomingEvent,
} from '@/db/mutations'
import { useRouter } from 'next/navigation'
import { formatDate } from '@/lib/date-utils'
import { useEffect } from 'react'

interface UpcomingEventsAdminClientProps {
    initialData: UpcomingEvent[]
}

export default function UpcomingEventsAdminClient({
    initialData,
}: UpcomingEventsAdminClientProps) {
    const router = useRouter()
    const [upcomingEvents, setUpcomingEvents] = useState(initialData)

    // Update state when initialData changes (after router.refresh())
    useEffect(() => {
        setUpcomingEvents(initialData)
    }, [initialData])
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        date: '',
        description: '',
        location: '',
        registrationLink: '',
        eventImageUrl: '',
    })

    const resetForm = () => {
        setFormData({
            name: '',
            date: '',
            description: '',
            location: '',
            registrationLink: '',
            eventImageUrl: '',
        })
        setEditingId(null)
    }

    const handleEdit = (event: UpcomingEvent) => {
        setFormData({
            name: event.name,
            date:
                event.date instanceof Date
                    ? event.date.toISOString().split('T')[0]
                    : event.date,
            description: event.description,
            location: event.location || '',
            registrationLink: event.registrationLink || '',
            eventImageUrl: event.eventImageUrl || '',
        })
        setEditingId(event.id)
        setIsCreateOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const validated = upcomingEventSchema.parse({
                ...formData,
                location: formData.location || undefined,
                registrationLink: formData.registrationLink || undefined,
                eventImageUrl: formData.eventImageUrl || undefined,
            })

            const dataToSubmit = {
                ...validated,
                date: new Date(validated.date),
                location: validated.location || null,
                registrationLink: validated.registrationLink || null,
                eventImageUrl: validated.eventImageUrl || null,
            }

            if (editingId) {
                await updateUpcomingEvent(editingId, dataToSubmit)
                toast.success('Upcoming event updated successfully')
            } else {
                await addUpcomingEvent(dataToSubmit)
                toast.success('Upcoming event created successfully')
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
                        ? 'Failed to update upcoming event'
                        : 'Failed to create upcoming event'
                )
            }
            console.error('Error:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this upcoming event?')) {
            return
        }

        try {
            await deleteUpcomingEvent(id)
            toast.success('Upcoming event deleted successfully')
            router.refresh()
        } catch (error) {
            toast.error('Failed to delete upcoming event')
            console.error('Error:', error)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Upcoming Events</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage upcoming events and activities
                    </p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>Add Upcoming Event</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>
                                {editingId ? 'Edit' : 'Create'} Upcoming Event
                            </DialogTitle>
                            <DialogDescription>
                                {editingId
                                    ? 'Update the upcoming event details'
                                    : 'Add a new upcoming event to the system'}
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
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    value={formData.location}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            location: e.target.value,
                                        })
                                    }
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="registrationLink">
                                    Registration Link
                                </Label>
                                <Input
                                    id="registrationLink"
                                    type="url"
                                    value={formData.registrationLink}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            registrationLink: e.target.value,
                                        })
                                    }
                                    placeholder="https://example.com/register"
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="eventImageUrl">
                                    Event Image URL
                                </Label>
                                <Input
                                    id="eventImageUrl"
                                    type="url"
                                    value={formData.eventImageUrl}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            eventImageUrl: e.target.value,
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

            {upcomingEvents.length === 0 ? (
                <div className="text-muted-foreground py-12 text-center">
                    No upcoming events found. Create one to get started.
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {upcomingEvents.map((event) => (
                                <TableRow key={event.id}>
                                    <TableCell className="font-medium">
                                        {event.name}
                                    </TableCell>
                                    <TableCell>
                                        {event.date instanceof Date
                                            ? event.date.toLocaleDateString()
                                            : new Date(
                                                  event.date
                                              ).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        {event.location || '-'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleEdit(event)
                                                }
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() =>
                                                    handleDelete(event.id)
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
