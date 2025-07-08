import React, { useState, useEffect } from 'react';
import AdminSidebar from '../admin.sidebar';
import './admincrew.css';
import { FaSearch, FaFilter, FaEdit, FaTrash } from 'react-icons/fa';
import CrewEditModal from '../adminmodal/crewEditModal';
import { db } from '../../../firebase';
import { collection, addDoc, getDocs, Timestamp, updateDoc, doc, runTransaction } from 'firebase/firestore';
import DeleteCrewModal from './deletecrew.jsx';
import EditCrewModal from './editcrew.jsx';
import SearchAndFilter from './search.jsx';

function AdminCrew() {
  // State for modals and crew data
  const [modalOpen, setModalOpen] = useState(false); // Add crew modal
  const [crewList, setCrewList] = useState([]); // All crew from Firestore
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // Delete (archive) modal
  const [selectedCrew, setSelectedCrew] = useState(null); // Crew selected for edit/delete
  const [editModalOpen, setEditModalOpen] = useState(false); // Edit crew modal
  const [searchTerm, setSearchTerm] = useState(''); // Search input value
  const [filterStatus, setFilterStatus] = useState('All'); // Status filter value

  // Fetch crew list from Firestore on mount
  useEffect(() => {
    const fetchCrew = async () => {
      // Get all crew documents from Firestore
      const querySnapshot = await getDocs(collection(db, 'crew'));
      const crewData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCrewList(crewData);
    };
    fetchCrew();
  }, []);

  // Add new crew to Firestore with unique, non-reusable crew_id
  // 1. Atomically increment the crew_id counter in Firestore
  // 2. Add the new crew with the next crew_id
  // 3. Refresh the crew list
  const handleAddCrew = async (crewData) => {
    const createdAt = Timestamp.now();
    let newCrewId;
    await runTransaction(db, async (transaction) => {
      const counterRef = doc(db, 'counters', 'crew_id');
      const counterSnap = await transaction.get(counterRef);
      let lastId = 0;
      if (counterSnap.exists()) {
        lastId = counterSnap.data().last_id || 0;
      }
      newCrewId = lastId + 1;
      transaction.set(counterRef, { last_id: newCrewId }, { merge: true });
    });
    await addDoc(collection(db, 'crew'), { ...crewData, createdAt, crew_id: newCrewId });
    // Refresh crew list
    const querySnapshot = await getDocs(collection(db, 'crew'));
    const crewDataList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setCrewList(crewDataList);
    setModalOpen(false);
  };

  // Archive crew (set status to Archived, but do not delete from DB)
  // 1. Update the selected crew's status to 'Archived' in Firestore
  // 2. Refresh the crew list
  const handleArchiveCrew = async () => {
    if (!selectedCrew) return;
    const { id } = selectedCrew;
    await updateDoc(doc(db, 'crew', id), { status: 'Archived' });
    // Refresh crew list
    const querySnapshot = await getDocs(collection(db, 'crew'));
    const crewDataList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setCrewList(crewDataList);
    setDeleteModalOpen(false);
    setSelectedCrew(null);
  };

  // Edit crew in Firestore
  // 1. Update the selected crew's fields in Firestore
  // 2. Refresh the crew list
  const handleEditCrew = async (updatedData) => {
    if (!selectedCrew) return;
    const { id } = selectedCrew;
    await updateDoc(doc(db, 'crew', id), updatedData);
    // Refresh crew list
    const querySnapshot = await getDocs(collection(db, 'crew'));
    const crewDataList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setCrewList(crewDataList);
    setEditModalOpen(false);
    setSelectedCrew(null);
  };

  // Filtering and searching logic:
  // 1. Only show Active and Inactive crew (never show Archived)
  // 2. Apply status filter if not 'All'
  // 3. Apply search filter on name, email, or crew_id
  let visibleCrew = crewList.filter(crew => crew.status === 'Active' || crew.status === 'Inactive');
  if (filterStatus !== 'All') {
    visibleCrew = visibleCrew.filter(crew => crew.status === filterStatus);
  }
  if (searchTerm.trim() !== '') {
    const term = searchTerm.trim().toLowerCase();
    visibleCrew = visibleCrew.filter(crew =>
      (crew.firstName && crew.firstName.toLowerCase().includes(term)) ||
      (crew.lastName && crew.lastName.toLowerCase().includes(term)) ||
      (crew.email && crew.email.toLowerCase().includes(term)) ||
      (crew.crew_id && String(crew.crew_id).padStart(4, '0').includes(term))
    );
  }
  // Sort by crew_id ascending
  visibleCrew.sort((a, b) => (a.crew_id || 0) - (b.crew_id || 0));

  // Render the Admin Crew Management UI
  return (
    <div className="adminpanel-root">
      <AdminSidebar />
      <main className="adminpanel-main">
        <div className="crew-header-row">
          <h2 className="crew-title">Crew Management</h2>
        </div>
        <div className="crew-actions-row">
          {/* Add Crew button opens the add modal */}
          <button className="crew-add-btn" onClick={() => setModalOpen(true)}>Add</button>
          {/* Search and filter bar */}
          <SearchAndFilter
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            filterStatus={filterStatus}
            onFilter={setFilterStatus}
          />
        </div>
        <div className="crew-table-container">
          <table className="crew-table">
            <thead>
              <tr>
                <th>Crew Id</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Gender</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleCrew.length === 0 ? (
                <tr><td colSpan="8" style={{ textAlign: 'center' }}>No crew found.</td></tr>
              ) : (
                visibleCrew.map((crew) => (
                  <tr key={crew.id}>
                    <td className="crew-id">{crew.crew_id ? String(crew.crew_id).padStart(4, '0') : ''}</td>
                    <td className="crew-fname">{crew.firstName}</td>
                    <td className="crew-lname">{crew.lastName}</td>
                    <td className="crew-email">{crew.email}</td>
                    <td className="crew-gender"><b>{crew.gender}</b></td>
                    <td className="crew-status"><b>{crew.status}</b></td>
                    <td className="crew-created"><b>{crew.createdAt && crew.createdAt.toDate ? crew.createdAt.toDate().toLocaleDateString() : ''}</b></td>
                    <td className="crew-actions">
                      {/* Edit button opens the edit modal for this crew */}
                      <button className="crew-action-btn" onClick={() => { setSelectedCrew(crew); setEditModalOpen(true); }}><FaEdit /></button>
                      {/* Delete button opens the archive modal for this crew */}
                      <button className="crew-action-btn" onClick={() => { setSelectedCrew(crew); setDeleteModalOpen(true); }}><FaTrash /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Add Crew Modal */}
        <CrewEditModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={handleAddCrew} />
        {/* Edit Crew Modal */}
        <EditCrewModal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} crew={selectedCrew} onSave={handleEditCrew} />
        {/* Archive Crew Modal */}
        <DeleteCrewModal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={handleArchiveCrew} crew={selectedCrew} />
      </main>
    </div>
  );
}

export default AdminCrew;
