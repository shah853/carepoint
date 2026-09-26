import { useEffect, useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import Loader from '../components/common/Loader';
import { getAllAppointments } from '../services/adminService';

const appointmentStatusStyles = {
	pending: 'bg-amber-100 text-amber-800',
	confirmed: 'bg-blue-100 text-blue-800',
	completed: 'bg-emerald-100 text-emerald-800',
	cancelled: 'bg-red-100 text-red-800',
};

function AdminAppointments() {
	const [appointments, setAppointments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		let active = true;

		getAllAppointments()
			.then((data) => {
				if (active) setAppointments(data);
			})
			.catch((requestError) => {
				if (active) setError(requestError.response?.data?.message || 'Could not load appointments.');
			})
			.finally(() => {
				if (active) setLoading(false);
			});

		return () => { active = false; };
	}, []);

	return (
		<AdminLayout>
			<div className="mx-auto max-w-7xl">
					<header className="mb-6">
						<p className="text-sm font-medium text-teal-700">Care coordination</p>
						<h1 className="mt-1 text-2xl font-semibold text-slate-950">Appointments</h1>
					</header>
					{error ? <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{error}</p> : null}
					{loading ? <Loader /> : (
						<div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
							<div className="overflow-x-auto">
								<table className="min-w-190 w-full border-collapse text-left text-sm">
									<thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
										<tr>
											<th className="px-4 py-3 font-semibold">Patient</th>
											<th className="px-4 py-3 font-semibold">Doctor</th>
											<th className="px-4 py-3 font-semibold">Date</th>
											<th className="px-4 py-3 font-semibold">Time</th>
											<th className="px-4 py-3 font-semibold">Status</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-slate-100">
										{appointments.length === 0 ? (
											<tr><td className="px-4 py-12 text-center text-slate-500" colSpan="5">No appointments found.</td></tr>
										) : appointments.map((appointment) => (
											<tr className="text-slate-700" key={appointment._id}>
												<td className="px-4 py-3">
													<div className="font-medium text-slate-900">{appointment.user?.name || 'Patient'}</div>
													<div className="text-xs text-slate-500">{appointment.user?.email || ''}</div>
												</td>
												<td className="px-4 py-3">
													<div className="font-medium text-slate-900">{appointment.doctor?.name || 'Doctor'}</div>
													<div className="text-xs text-slate-500">{appointment.doctor?.specialization || ''}</div>
												</td>
												<td className="whitespace-nowrap px-4 py-3">{appointment.date ? new Date(appointment.date).toLocaleDateString() : 'N/A'}</td>
												<td className="whitespace-nowrap px-4 py-3">{appointment.time || 'N/A'}</td>
												<td className="px-4 py-3">
													<span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${appointmentStatusStyles[appointment.status] || 'bg-slate-100 text-slate-700'}`}>
														{appointment.status || 'unknown'}
													</span>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}
			</div>
		</AdminLayout>
	);
}

export default AdminAppointments;
