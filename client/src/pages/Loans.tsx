import { useLoans } from '../hooks/useLoans';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Laptop, Calendar, Clock, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'ACTIVE': return <Badge variant="info">En cours</Badge>;
        case 'OVERDUE': return <Badge variant="danger">En retard</Badge>;
        case 'COMPLETED': return <Badge variant="success">Terminé</Badge>;
        case 'PENDING': return <Badge variant="warning">En attente</Badge>;
        case 'CANCELLED': return <Badge variant="default">Annulé</Badge>;
        default: return <Badge variant="default">{status}</Badge>;
    }
};

export default function Loans() {
    const { data: loans, isLoading } = useLoans();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Suivi des Emprunts</h1>
                <p className="text-gray-500 mt-2">Historique complet et gestion des prêts en cours.</p>
            </div>

            <Card className="border-none shadow-sm overflow-hidden bg-white">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Matériel</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Emprunteur</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Période</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Rendu le</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Qté</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Statut</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {isLoading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={6} className="px-6 py-8 h-16 bg-gray-50/20" />
                                        </tr>
                                    ))
                                ) : loans && loans.length > 0 ? (
                                    [...loans]
                                        .sort((a, b) => {
                                            // Sort by pickupDate descending, handle missing dates safely
                                            const dateA = a.pickupDate ?? '';
                                            const dateB = b.pickupDate ?? '';
                                            return dateB.localeCompare(dateA);
                                        })
                                        .map((loan) => {
                                            const equipmentName = typeof loan.equipment === 'object' ? loan.equipment?.name : '—';
                                            const borrowerEmail = typeof loan.borrower === 'object' ? loan.borrower?.email : '—';
                                            // Overdue: not returned + dueDate passed
                                            const isOverdue = !loan.returnDate && loan.dueDate
                                                ? new Date(loan.dueDate) < new Date()
                                                : false;
                                            // Extract initials from email (e.g. "john.doe@..." → "JD")
                                            const initials = borrowerEmail
                                                .split('@')[0]
                                                .split(/[.\-_]/)
                                                .filter(Boolean)
                                                .slice(0, 2)
                                                .map((s: string) => s[0]?.toUpperCase())
                                                .join('');

                                            return (
                                                <tr key={loan.id} className={`transition-colors group ${isOverdue ? 'bg-red-50 hover:bg-red-100 border-l-4 border-l-red-400' : 'hover:bg-gray-50/50'}`}>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-gray-100 rounded-lg text-gray-500 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                                                <Laptop size={18} />
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-gray-900">{equipmentName}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-7 w-7 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-[10px] font-bold">
                                                                {initials || '?'}
                                                            </div>
                                                            <div className="text-sm font-medium text-gray-700">
                                                                {borrowerEmail}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                                                <Calendar size={12} className="text-gray-400" />
                                                                <span>Du {loan.pickupDate ?? '—'}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                                                <Clock size={12} className="text-gray-400" />
                                                                <span>Au {loan.dueDate ?? '—'}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm font-medium">
                                                            {loan.returnDate ? (
                                                                <div className="flex items-center gap-1.5 text-green-600">
                                                                    <CheckCircle2 size={14} />
                                                                    {loan.returnDate}
                                                                </div>
                                                            ) : isOverdue ? (
                                                                <div className="flex items-center gap-1.5 text-red-600 font-semibold">
                                                                    <AlertTriangle size={14} />
                                                                    En retard
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-400">—</span>
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm font-medium text-gray-700">{loan.quantity}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {getStatusBadge(loan.status)}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-2 text-gray-400">
                                                <CheckCircle2 size={40} className="text-gray-200" />
                                                <p className="font-medium">Aucun emprunt enregistré</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Legend / Info */}
            <div className="flex gap-6 p-4 bg-primary-50/50 rounded-2xl border border-primary-100/50">
                <div className="flex items-center gap-2 text-xs text-primary-700 font-medium">
                    <AlertCircle size={14} />
                    <span>Les retards sont signalés automatiquement après 24h de dépassement.</span>
                </div>
            </div>
        </div>
    );
}
