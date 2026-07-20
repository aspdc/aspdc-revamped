'use client'

import { useState, useEffect } from 'react'
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import { leaderboardUserSchema } from '@/lib/admin-schemas'
import type { LeaderboardUser } from '@/db/types'
import {
    addLeaderboardUser,
    updateLeaderboardUser,
    deleteLeaderboardUser,
} from '@/db/mutations'
import { useRouter } from 'next/navigation'

interface LeaderboardAdminClientProps {
    initialData: LeaderboardUser[]
}

export default function LeaderboardAdminClient({
    initialData,
}: LeaderboardAdminClientProps) {
    const router = useRouter()
    const [users, setUsers] = useState(initialData)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Update state when initialData changes (after router.refresh())
    useEffect(() => {
        setUsers(initialData)
    }, [initialData])

    const [formData, setFormData] = useState({
        fullName: '',
        codeforcesHandle: '',
        leetcodeHandle: '',
    })

    const resetForm = () => {
        setFormData({
            fullName: '',
            codeforcesHandle: '',
            leetcodeHandle: '',
        })
        setEditingId(null)
    }

    const handleEdit = (user: LeaderboardUser) => {
        setFormData({
            fullName: user.fullName,
            codeforcesHandle: user.codeforcesHandle,
            leetcodeHandle: user.leetcodeHandle || '',
        })
        setEditingId(user.id)
        setIsCreateOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const validated = leaderboardUserSchema.parse({
                ...formData,
                leetcodeHandle: formData.leetcodeHandle || undefined,
            })

            const dataToSubmit = {
                ...validated,
                leetcodeHandle: validated.leetcodeHandle || null,
            }

            if (editingId) {
                await updateLeaderboardUser(editingId, dataToSubmit)
                toast.success('User updated successfully')
            } else {
                await addLeaderboardUser(dataToSubmit)
                toast.success('User added successfully')
            }

            router.refresh()
            resetForm()
            setIsCreateOpen(false)
        } catch (error) {
            if (error instanceof Error && error.name === 'ZodError') {
                toast.error('Validation failed. Please check your inputs.')
            } else {
                toast.error(
                    editingId ? 'Failed to update user' : 'Failed to add user'
                )
            }
            console.error('Error:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) {
            return
        }

        try {
            await deleteLeaderboardUser(id)
            toast.success('User deleted successfully')
            router.refresh()
        } catch (error) {
            toast.error('Failed to delete user')
            console.error('Error:', error)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Leaderboard Users</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage users registered for the Codeforces leaderboard
                    </p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>Add User</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingId ? 'Edit' : 'Add'} Leaderboard User
                            </DialogTitle>
                            <DialogDescription>
                                {editingId
                                    ? 'Update the user details'
                                    : 'Add a new user to the leaderboard'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name *</Label>
                                <Input
                                    id="fullName"
                                    value={formData.fullName}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            fullName: e.target.value,
                                        })
                                    }
                                    required
                                    disabled={isSubmitting}
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="codeforcesHandle">
                                    Codeforces Handle *
                                </Label>
                                <Input
                                    id="codeforcesHandle"
                                    value={formData.codeforcesHandle}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            codeforcesHandle: e.target.value,
                                        })
                                    }
                                    required
                                    disabled={isSubmitting}
                                    placeholder="tourist"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="leetcodeHandle">
                                    LeetCode Handle
                                </Label>
                                <Input
                                    id="leetcodeHandle"
                                    value={formData.leetcodeHandle}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            leetcodeHandle: e.target.value,
                                        })
                                    }
                                    disabled={isSubmitting}
                                    placeholder="leetcode_user (optional)"
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
                                          : 'Add'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {users.length === 0 ? (
                <div className="text-muted-foreground py-12 text-center">
                    No users found. Add one to get started.
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Full Name</TableHead>
                                <TableHead>Codeforces Handle</TableHead>
                                <TableHead>LeetCode Handle</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                        {user.fullName}
                                    </TableCell>
                                    <TableCell>
                                        {user.codeforcesHandle}
                                    </TableCell>
                                    <TableCell>
                                        {user.leetcodeHandle || '-'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(user)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() =>
                                                    handleDelete(user.id)
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
