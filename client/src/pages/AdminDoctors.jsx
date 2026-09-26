import { useEffect, useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import Loader from '../components/common/Loader';
import { getDoctors } from '../services/doctorService';

function AdminDoctors() {
	const [doctors, setDoctors] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		let active = true;

		getDoctors()
			.then((data) => {
				if (active) setDoctors(Array.isArray(data) ? data : []);
			})
			.catch((requestError) => {
				if (active) setError(requestError.response?.data?.message || 'Could not load doctors.');
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
					<p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Care team</p>
					<h1 className="mt-1 text-2xl font-semibold text-slate-950">Doctors</h1>
				</header>
				{error ? <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{error}</p> : null}
				{loading ? <Loader /> : (
					<div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
						<div className="overflow-x-auto">
							<table className="min-w-190 w-full text-left text-sm">
								<thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
									<tr><th className="px-4 py-3 font-semibold">Doctor</th><th className="px-4 py-3 font-semibold">Specialization</th><th className="px-4 py-3 font-semibold">Department</th><th className="px-4 py-3 font-semibold">Experience</th><th className="px-4 py-3 font-semibold">Availability</th></tr>
								</thead>
								<tbody className="divide-y divide-slate-100">
									{doctors.length ? doctors.map((doctor) => (
										<tr className="text-slate-700" key={doctor._id}>
											<td className="px-4 py-3">
												<p className="font-medium text-slate-900">{doctor.name}</p>
												<p className="text-xs text-slate-500">{doctor.email}</p>
											</td>
											<td className="px-4 py-3">{doctor.specialization}</td>
											<td className="px-4 py-3">{doctor.department || 'General'}</td>
											<td className="px-4 py-3">{Number(doctor.experience || 0)} yrs</td>
											<td className="px-4 py-3">
												<span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${doctor.available ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
													{doctor.available ? 'Available' : 'Unavailable'}
												</span>
											</td>
										</tr>
									)) : <tr><td className="px-4 py-12 text-center text-slate-500" colSpan="5">No doctors found.</td></tr>}
								</tbody>
							</table>
						</div>
					</div>
				)}
			</div>
		</AdminLayout>
	);
}

export default AdminDoctors;
