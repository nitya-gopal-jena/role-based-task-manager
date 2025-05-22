import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MdEditSquare } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import { MdSearch } from 'react-icons/md';
import { getCurrentUserRole, ROLE_ADMIN, ROLE_USER } from '../../utils/Utils';
import { toast } from 'react-toastify';
import '../../styles/tasks/taskslist.css';

const TasksList = ({ showUserTasks = false }) => {
  const [taskslist, setTasksList] = useState([]);
  const [error, setError] = useState('');
  const [totalTask, setTotalTask] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const TASKS_PER_PAGE = 10;

  useEffect(() => {
    const fetchTotalTasksNo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/tasks/count/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTotalTask(response.data.totalNoOftask);
      } catch (error) {
        console.log('Failed to fetch the no of tasks', error);
      }
    };

    const fetchTasksList = async () => {
      try {
        const token = localStorage.getItem('token');
        const url = showUserTasks
          ? `http://localhost:5000/api/tasks/mytasks?page=${currentPage}&limit=${TASKS_PER_PAGE}${searchQuery ? `&search=${searchQuery}` : ''}`
          : `http://localhost:5000/api/tasks/?page=${currentPage}&limit=${TASKS_PER_PAGE}${searchQuery ? `&search=${searchQuery}` : ''}`;

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const tasks = showUserTasks ? response.data.tasks : response.data.alltask;
        setPages(response.data.pages);
        setTasksList(tasks);
        setTotalTask(response.data.total);
      } catch (error) {
        setError(showUserTasks ? 'Failed to load your tasks.' : 'Failed to fetch tasks list.');
      }
    };

    fetchTotalTasksNo();
    fetchTasksList();
  }, [currentPage, searchQuery]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Delete the task  from database
  const handleDeleteTask = async (taskId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this task ?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(response.data.message);
      window.location.reload();
    } catch (error) {
      toast.error('Failed to delete task', error);
    }
  };

  // Function to navigate to edit task page
  const editTask = (taskId) => {
    navigate(`/edit-task/${taskId}`);
  };

  const addTask = (e) => {
    e.preventDefault();
    navigate('/add-task');
  };

  // Next/Prev button for pagination
  const goToNextPage = () => {
    if (currentPage < pages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <>
      <div className='main-container'>
        <div className='task-table-container'>
          <div className='header-content'>
            <h3 className='task-title'>{showUserTasks ? 'My Tasks' : 'All Tasks'}</h3>
            <span className='task-no'>No of tasks: {totalTask}</span>

            <div className='header-right'>
              {/* Search Bar */}
              <div className='search-container'>
                <div className='search-input-wrapper'>
                  <MdSearch className='search-icon' />
                  <input type='text' placeholder='Search tasks...' value={searchQuery} onChange={handleSearchChange} className='search-input' />
                </div>
              </div>

              {getCurrentUserRole() === ROLE_ADMIN && !showUserTasks && (
                <button className='add-task-btn' onClick={addTask}>
                  Add Task
                </button>
              )}
            </div>
          </div>
          <hr />

          {error && <p className='error-message'>{error}</p>}
          <div className='table-wrapper'>
            <table className='task-table'>
              <thead>
                <tr>
                  <th>Sl No</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Assign To</th>
                  <th>Created By</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th colSpan='2'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {taskslist.map((alltask, index) => (
                  <tr key={alltask._id || index}>
                    <td className='sl-no'>{(currentPage - 1) * TASKS_PER_PAGE + index + 1}</td>
                    <td>{alltask.title}</td>
                    <td>{alltask.description}</td>
                    <td>{alltask.assignToName}</td>
                    <td>{alltask.createdByName}</td>
                    <td>{alltask.status}</td>
                    <td>{alltask.dueDate?.slice(0, 10)}</td>
                    <td>
                      <button className='edit-btn' onClick={() => editTask(alltask._id)}>
                        <MdEditSquare className='edit-btn-icon' />
                      </button>
                    </td>
                    <td>
                      <button className='delete-btn' onClick={() => handleDeleteTask(alltask._id)}>
                        <MdDelete className='delete-btn-icon' />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Buttons */}
          <div className='pagination-container'>
            <button className='pagination-btn' onClick={goToPrevPage} disabled={currentPage === 1}>
              Prev
            </button>
            <span className='pagination-info'>
              Page {currentPage} of {pages}
            </span>
            <button className='pagination-btn' onClick={goToNextPage} disabled={currentPage === pages}>
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TasksList;
