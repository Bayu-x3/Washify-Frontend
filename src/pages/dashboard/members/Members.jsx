import { useState } from "react";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

function Members() {
  const [user] = useState({ name: "Admin", role: "Administrator" });

  // Data Statis untuk Members
  const members = [
    { id: 1, name: "John Doe", email: "john.doe@example.com", phone: "081234567890", totalTransactions: 12 },
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com", phone: "081987654321", totalTransactions: 8 },
    { id: 3, name: "Michael Johnson", email: "michael.johnson@example.com", phone: "081345678901", totalTransactions: 15 },
    { id: 4, name: "Emily Davis", email: "emily.davis@example.com", phone: "081223344556", totalTransactions: 20 },
    { id: 5, name: "Chris Brown", email: "chris.brown@example.com", phone: "081556677889", totalTransactions: 5 },
  ];

  return (
<div className="flex min-h-screen bg-gray-100">
  {/* Sidebar */}
  <Sidebar />

  <div className="flex flex-1 flex-col">
    {/* Navbar */}
    <Navbar user={user} />

    {/* Main Content */}
    <main className="flex-1 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Members</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          + Add Member
        </button>
      </div>

      {/* Table Members */}
      <div className="mt-6 bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Transactions
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.map((member) => (
              <tr key={member.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {member.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.totalTransactions}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>

    {/* Footer */}
    <Footer />
  </div>
</div>

  );
}

export default Members;
