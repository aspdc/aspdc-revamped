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
import { blogSchema } from '@/lib/admin-schemas'
import type { Blog } from '@/db/types'
import { addBlog, updateBlog, deleteBlog } from '@/db/mutations'
import { useRouter } from 'next/navigation'
import { formatDate } from '@/lib/date-utils'
import { useEffect } from 'react'

interface BlogsAdminClientProps {
    initialData: Blog[]
}

export default function BlogsAdminClient({
    initialData,
}: BlogsAdminClientProps) {
    const router = useRouter()
    const [blogs, setBlogs] = useState(initialData)
    const [isCreateOpen, setIsCreateOpen] = useState(false)

    // Update state when initialData changes (after router.refresh())
    useEffect(() => {
        setBlogs(initialData)
    }, [initialData])
    const [editingId, setEditingId] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        link: '',
        publishDate: '',
        coverImage: '',
    })

    const resetForm = () => {
        setFormData({
            title: '',
            author: '',
            link: '',
            publishDate: '',
            coverImage: '',
        })
        setEditingId(null)
    }

    const handleEdit = (blog: Blog) => {
        setFormData({
            title: blog.title,
            author: blog.author,
            link: blog.link,
            publishDate:
                blog.publishDate instanceof Date
                    ? blog.publishDate.toISOString().split('T')[0]
                    : blog.publishDate,
            coverImage: blog.coverImage || '',
        })
        setEditingId(blog.id)
        setIsCreateOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const validated = blogSchema.parse({
                ...formData,
                coverImage: formData.coverImage || undefined,
            })

            const dataToSubmit = {
                ...validated,
                publishDate: new Date(validated.publishDate),
                coverImage: validated.coverImage || null,
            }

            if (editingId) {
                await updateBlog(editingId, dataToSubmit)
                toast.success('Blog updated successfully')
            } else {
                await addBlog(dataToSubmit)
                toast.success('Blog created successfully')
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
                        ? 'Failed to update blog'
                        : 'Failed to create blog'
                )
            }
            console.error('Error:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this blog?')) {
            return
        }

        try {
            await deleteBlog(id)
            toast.success('Blog deleted successfully')
            router.refresh()
        } catch (error) {
            toast.error('Failed to delete blog')
            console.error('Error:', error)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Blogs</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage blog posts and articles
                    </p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>Add Blog</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>
                                {editingId ? 'Edit' : 'Create'} Blog
                            </DialogTitle>
                            <DialogDescription>
                                {editingId
                                    ? 'Update the blog details'
                                    : 'Add a new blog to the system'}
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
                                <Label htmlFor="link">Link *</Label>
                                <Input
                                    id="link"
                                    type="url"
                                    value={formData.link}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            link: e.target.value,
                                        })
                                    }
                                    placeholder="https://example.com/blog"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="publishDate">
                                    Publish Date *
                                </Label>
                                <Input
                                    id="publishDate"
                                    type="date"
                                    value={formData.publishDate}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            publishDate: e.target.value,
                                        })
                                    }
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="coverImage">
                                    Cover Image URL
                                </Label>
                                <Input
                                    id="coverImage"
                                    type="url"
                                    value={formData.coverImage}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            coverImage: e.target.value,
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

            {blogs.length === 0 ? (
                <div className="text-muted-foreground py-12 text-center">
                    No blogs found. Create one to get started.
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>Publish Date</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {blogs.map((blog) => (
                                <TableRow key={blog.id}>
                                    <TableCell className="font-medium">
                                        {blog.title}
                                    </TableCell>
                                    <TableCell>{blog.author}</TableCell>
                                    <TableCell>
                                        {formatDate(blog.publishDate)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(blog)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() =>
                                                    handleDelete(blog.id)
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
