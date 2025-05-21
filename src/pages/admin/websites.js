import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { FaGlobe, FaUser, FaEdit, FaTrash, FaCheckCircle } from 'react-icons/fa';

// MOCK: Lista siti demo
const mockSites = [
  {
    _id: '1',
    name: 'Sito Mario',
    slug: 'sito-mario',
    owner: 'Mario Rossi',
    status: 'published',
    date: '2024-06-01'
  },
  {
    _id: '2',
    name: 'E-commerce Luca',
    slug: 'ecommerce-luca',
    owner: 'Luca Bianchi',
    status: 'draft',
    date: '2024-05-20'
  },
  {
    _id: '3',
    name: 'Blog Giulia',
    slug: 'blog-giulia',
    owner: 'Giulia Verdi',
    status: 'published',
    date: '2024-05-10'
  }
];

export default function AdminWebsites() {
  const [sites, setSites] = useState(mockSites);

  return (
    <AdminLayout>
      <section className="max-w-5xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-yellow-700 mb-8 flex items-center gap-2"><FaGlobe className="text-yellow-500" /> Gestione Siti Web</h1>
        <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-yellow-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Nome</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Slug</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Owner</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Stato</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Data</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Azioni</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {sites.map(site => (
                <tr key={site._id} className="hover:bg-yellow-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-900 flex items-center gap-2"><FaGlobe className="text-yellow-400" /> {site.name}</td>
                  <td className="px-4 py-3 text-gray-700">{site.slug}</td>
                  <td className="px-4 py-3 text-gray-700 flex items-center gap-2"><FaUser className="text-indigo-400" /> {site.owner}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${site.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {site.status === 'published' ? <FaCheckCircle className="text-green-400 mr-1" /> : null}
                      {site.status === 'published' ? 'Pubblicato' : 'Bozza'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{site.date}</td>
                  <td className="px-4 py-3 flex items-center gap-3 justify-center">
                    <button className="p-2 rounded-full bg-yellow-100 hover:bg-yellow-200 text-yellow-700 transition" title="Modifica"><FaEdit /></button>
                    <button className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition" title="Elimina"><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
} 