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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import {
    tournamentContestSchema,
    tournamentParticipantSchema,
    tournamentScoreSchema,
} from '@/lib/admin-schemas'
import type {
    TournamentContest,
    TournamentParticipant,
    TournamentScore,
} from '@/db/types'
import {
    addTournamentContest,
    deleteTournamentContest,
    addTournamentParticipant,
    updateTournamentParticipant,
    deleteTournamentParticipant,
    addTournamentScore,
    deleteTournamentScore,
} from '@/db/mutations'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface TournamentAdminClientProps {
    initialContests: TournamentContest[]
    initialParticipants: TournamentParticipant[]
    initialScores: TournamentScore[]
}

export default function TournamentAdminClient({
    initialContests,
    initialParticipants,
    initialScores,
}: TournamentAdminClientProps) {
    const router = useRouter()
    const [contests, setContests] = useState(initialContests)
    const [participants, setParticipants] = useState(initialParticipants)
    const [scores, setScores] = useState(initialScores)

    const [isContestDialogOpen, setIsContestDialogOpen] = useState(false)
    const [isParticipantDialogOpen, setIsParticipantDialogOpen] =
        useState(false)
    const [isScoreDialogOpen, setIsScoreDialogOpen] = useState(false)
    const [editingParticipantId, setEditingParticipantId] = useState<
        string | null
    >(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [contestForm, setContestForm] = useState({ name: '' })
    const [participantForm, setParticipantForm] = useState({
        name: '',
        codeforcesHandle: '',
    })
    const [scoreForm, setScoreForm] = useState({
        participantId: '',
        contestId: '',
        points: 0,
    })

    useEffect(() => {
        setContests(initialContests)
        setParticipants(initialParticipants)
        setScores(initialScores)
    }, [initialContests, initialParticipants, initialScores])

    // Contest handlers
    const handleAddContest = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            tournamentContestSchema.parse(contestForm)
            await addTournamentContest(contestForm)
            toast.success('Contest added successfully')
            router.refresh()
            setContestForm({ name: '' })
            setIsContestDialogOpen(false)
        } catch (error) {
            toast.error('Failed to add contest')
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteContest = async (id: string) => {
        if (
            !confirm(
                'Delete this contest? All associated scores will be removed.'
            )
        )
            return
        try {
            await deleteTournamentContest(id)
            toast.success('Contest deleted')
            router.refresh()
        } catch (error) {
            toast.error('Failed to delete contest')
            console.error(error)
        }
    }

    // Participant handlers
    const handleParticipantSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            tournamentParticipantSchema.parse(participantForm)
            if (editingParticipantId) {
                await updateTournamentParticipant(
                    editingParticipantId,
                    participantForm
                )
                toast.success('Participant updated')
            } else {
                await addTournamentParticipant(participantForm)
                toast.success('Participant added')
            }
            router.refresh()
            setParticipantForm({ name: '', codeforcesHandle: '' })
            setEditingParticipantId(null)
            setIsParticipantDialogOpen(false)
        } catch (error) {
            toast.error('Failed to save participant')
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEditParticipant = (p: TournamentParticipant) => {
        setParticipantForm({
            name: p.name,
            codeforcesHandle: p.codeforcesHandle,
        })
        setEditingParticipantId(p.id)
        setIsParticipantDialogOpen(true)
    }

    const handleDeleteParticipant = async (id: string) => {
        if (
            !confirm(
                'Delete this participant? All their scores will be removed.'
            )
        )
            return
        try {
            await deleteTournamentParticipant(id)
            toast.success('Participant deleted')
            router.refresh()
        } catch (error) {
            toast.error('Failed to delete participant')
            console.error(error)
        }
    }

    // Score handlers
    const handleAddScore = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            tournamentScoreSchema.parse(scoreForm)
            await addTournamentScore(scoreForm)
            toast.success('Score added')
            router.refresh()
            setScoreForm({ participantId: '', contestId: '', points: 0 })
            setIsScoreDialogOpen(false)
        } catch (error) {
            toast.error('Failed to add score')
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteScore = async (id: string) => {
        if (!confirm('Delete this score?')) return
        try {
            await deleteTournamentScore(id)
            toast.success('Score deleted')
            router.refresh()
        } catch (error) {
            toast.error('Failed to delete score')
            console.error(error)
        }
    }

    const getParticipantName = (id: string) =>
        participants.find((p) => p.id === id)?.name ?? 'Unknown'
    const getContestName = (id: string) =>
        contests.find((c) => c.id === id)?.name ?? 'Unknown'

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Tournament Leaderboard</h1>
                <p className="text-muted-foreground mt-2">
                    Manage contests, participants, and scores
                </p>
            </div>

            {/* Contests Section */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Contests</CardTitle>
                    <Dialog
                        open={isContestDialogOpen}
                        onOpenChange={setIsContestDialogOpen}
                    >
                        <DialogTrigger asChild>
                            <Button size="sm">Add Contest</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Contest</DialogTitle>
                                <DialogDescription>
                                    Create a new contest for the tournament
                                </DialogDescription>
                            </DialogHeader>
                            <form
                                onSubmit={handleAddContest}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="contestName">
                                        Contest Name *
                                    </Label>
                                    <Input
                                        id="contestName"
                                        value={contestForm.name}
                                        onChange={(e) =>
                                            setContestForm({
                                                name: e.target.value,
                                            })
                                        }
                                        required
                                        disabled={isSubmitting}
                                        placeholder="Round 1"
                                    />
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            setIsContestDialogOpen(false)
                                        }
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Adding...' : 'Add'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    {contests.length === 0 ? (
                        <p className="text-muted-foreground py-4 text-center">
                            No contests yet. Add one to get started.
                        </p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {contests.map((c) => (
                                <div
                                    key={c.id}
                                    className="bg-muted flex items-center gap-2 rounded-md px-3 py-1.5"
                                >
                                    <span>{c.name}</span>
                                    <button
                                        onClick={() =>
                                            handleDeleteContest(c.id)
                                        }
                                        className="text-destructive hover:text-destructive/80 text-sm"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Participants Section */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Participants</CardTitle>
                    <Dialog
                        open={isParticipantDialogOpen}
                        onOpenChange={(open) => {
                            setIsParticipantDialogOpen(open)
                            if (!open) {
                                setParticipantForm({
                                    name: '',
                                    codeforcesHandle: '',
                                })
                                setEditingParticipantId(null)
                            }
                        }}
                    >
                        <DialogTrigger asChild>
                            <Button size="sm">Add Participant</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    {editingParticipantId ? 'Edit' : 'Add'}{' '}
                                    Participant
                                </DialogTitle>
                                <DialogDescription>
                                    {editingParticipantId
                                        ? 'Update participant details'
                                        : 'Add a new participant to the tournament'}
                                </DialogDescription>
                            </DialogHeader>
                            <form
                                onSubmit={handleParticipantSubmit}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="participantName">
                                        Name *
                                    </Label>
                                    <Input
                                        id="participantName"
                                        value={participantForm.name}
                                        onChange={(e) =>
                                            setParticipantForm({
                                                ...participantForm,
                                                name: e.target.value,
                                            })
                                        }
                                        required
                                        disabled={isSubmitting}
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cfHandle">
                                        Codeforces Handle *
                                    </Label>
                                    <Input
                                        id="cfHandle"
                                        value={participantForm.codeforcesHandle}
                                        onChange={(e) =>
                                            setParticipantForm({
                                                ...participantForm,
                                                codeforcesHandle:
                                                    e.target.value,
                                            })
                                        }
                                        required
                                        disabled={isSubmitting}
                                        placeholder="tourist"
                                    />
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            setIsParticipantDialogOpen(false)
                                        }
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting
                                            ? 'Saving...'
                                            : editingParticipantId
                                              ? 'Update'
                                              : 'Add'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    {participants.length === 0 ? (
                        <p className="text-muted-foreground py-4 text-center">
                            No participants yet.
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>CF Handle</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {participants.map((p) => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-medium">
                                            {p.name}
                                        </TableCell>
                                        <TableCell>
                                            {p.codeforcesHandle}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleEditParticipant(p)
                                                    }
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDeleteParticipant(
                                                            p.id
                                                        )
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
                    )}
                </CardContent>
            </Card>

            {/* Scores Section */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Scores</CardTitle>
                    <Dialog
                        open={isScoreDialogOpen}
                        onOpenChange={setIsScoreDialogOpen}
                    >
                        <DialogTrigger asChild>
                            <Button
                                size="sm"
                                disabled={
                                    participants.length === 0 ||
                                    contests.length === 0
                                }
                            >
                                Add Score
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Score</DialogTitle>
                                <DialogDescription>
                                    Assign points to a participant for a contest
                                </DialogDescription>
                            </DialogHeader>
                            <form
                                onSubmit={handleAddScore}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <Label>Participant *</Label>
                                    <Select
                                        value={scoreForm.participantId}
                                        onValueChange={(v) =>
                                            setScoreForm({
                                                ...scoreForm,
                                                participantId: v,
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select participant" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {participants.map((p) => (
                                                <SelectItem
                                                    key={p.id}
                                                    value={p.id}
                                                >
                                                    {p.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Contest *</Label>
                                    <Select
                                        value={scoreForm.contestId}
                                        onValueChange={(v) =>
                                            setScoreForm({
                                                ...scoreForm,
                                                contestId: v,
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select contest" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {contests.map((c) => (
                                                <SelectItem
                                                    key={c.id}
                                                    value={c.id}
                                                >
                                                    {c.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="points">Points *</Label>
                                    <Input
                                        id="points"
                                        type="number"
                                        min={0}
                                        value={scoreForm.points}
                                        onChange={(e) =>
                                            setScoreForm({
                                                ...scoreForm,
                                                points:
                                                    parseInt(e.target.value) ||
                                                    0,
                                            })
                                        }
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            setIsScoreDialogOpen(false)
                                        }
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Adding...' : 'Add'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    {scores.length === 0 ? (
                        <p className="text-muted-foreground py-4 text-center">
                            No scores recorded yet.
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Participant</TableHead>
                                    <TableHead>Contest</TableHead>
                                    <TableHead>Points</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {scores.map((s) => (
                                    <TableRow key={s.id}>
                                        <TableCell className="font-medium">
                                            {getParticipantName(
                                                s.participantId
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {getContestName(s.contestId)}
                                        </TableCell>
                                        <TableCell>{s.points}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() =>
                                                    handleDeleteScore(s.id)
                                                }
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
