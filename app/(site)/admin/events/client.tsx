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
import { eventSchema } from '@/lib/admin-schemas'
import type { Event } from '@/db/types'
import { addEvent, updateEvent, deleteEvent } from '@/db/mutations'
import { useRouter } from 'next/navigation'
import { formatDate } from '@/lib/date-utils'
import { useEffect } from 'react'

interface EventsAdminClientProps {
    initialData: Event[]
}

export default function EventsAdminClient({
    initialData,
}: EventsAdminClientProps) {
    const router = useRouter()
    const [events, setEvents] = useState(initialData)

    // Update state when initialData changes (after router.refresh())
    useEffect(() => {
        setEvents(initialData)
    }, [initialData])
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        date: '',
        details: '',
        imageUrls: '',
    })

    const resetForm = () => {
        setFormData({
            name: '',
            date: '',
            details: '',
            imageUrls: '',
        })
        setEditingId(null)
    }

    const handleEdit = (event: Event) => {
        setFormData({
            name: event.name,
            date:
                event.date instanceof Date
                    ? event.date.toISOString().split('T')[0]
                    : event.date,
            details: event.details,
            imageUrls: event.imageUrls.join(', '),
        })
        setEditingId(event.id)
        setIsCreateOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const imageUrlsArray = formData.imageUrls
                ? formData.imageUrls
                      .split(',')
                      .map((url) => url.trim())
                      .filter(Boolean)
                : []

            const validated = eventSchema.parse({
                name: formData.name,
                date: formData.date,
                details: formData.details,
                imageUrls: imageUrlsArray,
            })

            const dataToSubmit = {
                ...validated,
                date: new Date(validated.date),
            }

            if (editingId) {
                await updateEvent(editingId, dataToSubmit)
                toast.success('Event updated successfully')
            } else {
                await addEvent(dataToSubmit)
                toast.success('Event created successfully')
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
                        ? 'Failed to update event'
                        : 'Failed to create event'
                )
            }
            console.error('Error:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this event?')) {
            return
        }

        try {
            await deleteEvent(id)
            toast.success('Event deleted successfully')
            router.refresh()
        } catch (error) {
            toast.error('Failed to delete event')
            console.error('Error:', error)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Events</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage events and activities
                    </p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>Add Event</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>
                                {editingId ? 'Edit' : 'Create'} Event
                            </DialogTitle>
                            <DialogDescription>
                                {editingId
                                    ? 'Update the event details'
                                    : 'Add a new event to the system'}
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
                                <Label htmlFor="details">Details *</Label>
                                <Textarea
                                    id="details"
                                    value={formData.details}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            details: e.target.value,
                                        })
                                    }
                                    required
                                    disabled={isSubmitting}
                                    rows={4}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="imageUrls">
                                    Image URLs (comma-separated)
                                </Label>
                                <Input
                                    id="imageUrls"
                                    type="text"
                                    value={formData.imageUrls}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            imageUrls: e.target.value,
                                        })
                                    }
                                    placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
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

            {events.length === 0 ? (
                <div className="text-muted-foreground py-12 text-center">
                    No events found. Create one to get started.
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {events.map((event) => (
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
                                    <TableCell className="max-w-md truncate">
                                        {event.details}
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
