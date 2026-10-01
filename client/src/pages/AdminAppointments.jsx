import { useEffect, useState } from 'react';
import { IconSearch, IconX } from '@tabler/icons-react';
import AdminLayout from '../components/admin/AdminLayout';
import StatusDropdown from '../components/admin/StatusDropdown';
import Loader from '../components/common/Loader';
import { getAllAppointments, updateAppointmentStatus } from '../services/adminService';

const appointmentStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];

const appointmentStatusStyles = {
	pending: 'bg-amber-100 text-amber-800',
	confirmed: 'bg-blue-100 text-blue-800',
	completed: 'bg-emerald-100 text-emerald-800',
	cancelled: 'bg-red-100 text-red-800',
};

function AdminAppointments() {
	const [appointments, setAppointments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState('');
	const [searching, setSearching] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		let active = true;
		const timeoutId = window.setTimeout(() => {
			getAllAppointments(search.trim())
				.then((data) => {
					if (active) setAppointments(data);
				})
				.catch((requestError) => {
					if (active) setError(requestError.response?.data?.message || 'Could not load appointments.');
				})
				.finally(() => {
					if (active) {
						setLoading(false);
						setSearching(false);
					}
				});
		}, search.trim() ? 250 : 0);

		return () => {
			active = false;
			window.clearTimeout(timeoutId);
		};
	}, [search]);

	const handleSearchChange = (event) => {
		setSearch(event.target.value);
		setSearching(true);
		setError('');
	};

	const clearSearch = () => {
		setSearch('');
		setSearching(true);
		setError('');
	};

	const handleStatusChange = async (id, status) => {
		setError('');
		try {
			const updatedAppointment = await updateAppointmentStatus(id, status);
			setAppointments((currentAppointments) => currentAppointments.map((appointment) => (
				appointment._id === id ? { ...appointment, ...updatedAppointment } : appointment
			)));
		} catch (requestError) {
			setError(requestError.response?.data?.message || 'Could not update the appointment.');
		}
	};

	return (
		<AdminLayout>
			<div className="mx-auto max-w-7xl">
					<header className="mb-6">
						<p className="text-sm font-medium text-teal-700">Care coordination</p>
						<h1 className="mt-1 text-2xl font-semibold text-slate-950">Appointments</h1>
					</header>
					<div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
						<div className="relative w-full sm:max-w-xl">
							<IconSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
							<input
								aria-label="Search appointments by patient name, contact number, appointment ID, or date"
								className="w-full rounded-md border border-slate-300 bg-white py-2 pl-10 pr-10 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
								onChange={handleSearchChange}
								placeholder="Search patient, phone, appointment ID, or date..."
								value={search}
							/>
							{search ? (
								<button
									aria-label="Clear appointment search"
									className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700"
									onClick={clearSearch}
									type="button"
								>
									<IconX size={16} />
								</button>
							) : null}
						</div>
						{searching ? (
							<span className="inline-flex items-center gap-2 text-sm text-slate-500" role="status">
								<span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-teal-600" />
								Searching...
							</span>
						) : null}
					</div>
					{error ? <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{error}</p> : null}
					{loading ? <Loader /> : (
						appointments.length === 0 && search.trim() ? (
							<p className="rounded-lg border border-slate-200 bg-white px-4 py-12 text-center text-sm text-slate-500">
								No appointments found for '{search.trim()}'
							</p>
						) : (
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
															<div className="text-xs text-slate-600">{appointment.contactNumber || 'Contact number unavailable'}</div>
												</td>
												<td className="px-4 py-3">
													<div className="font-medium text-slate-900">{appointment.doctor?.name || 'Doctor'}</div>
													<div className="text-xs text-slate-500">{appointment.doctor?.specialization || ''}</div>
												</td>
												<td className="whitespace-nowrap px-4 py-3">{appointment.date ? new Date(appointment.date).toLocaleDateString() : 'N/A'}</td>
												<td className="whitespace-nowrap px-4 py-3">{appointment.time || 'N/A'}</td>
												<td className="px-4 py-3">
													<div className="flex min-w-40 flex-col items-start gap-2">
														<span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${appointmentStatusStyles[appointment.status] || 'bg-slate-100 text-slate-700'}`}>
															{appointment.status || 'unknown'}
														</span>
														<StatusDropdown
															ariaLabel={`Change appointment status for ${appointment._id}`}
															currentStatus={appointment.status}
															onChange={(status) => handleStatusChange(appointment._id, status)}
															statuses={appointmentStatuses}
														/>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
						)
					)}
			</div>
		</AdminLayout>
	);
}

export default AdminAppointments;
