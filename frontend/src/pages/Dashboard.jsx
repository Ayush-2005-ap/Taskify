import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import API from "../api/axios";

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [deadline, setDeadline] = useState("");
    const [filter, setFilter] = useState("All");
    const [userName, setUserName] = useState("");


    const navigate = useNavigate();

    const fetchTasks = async () => {
        try {
            const res = await API.get("/tasks");
            setTasks(res.data);
        } catch {
            navigate("/");
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) navigate("/");

        const decoded = jwtDecode(token);
        setUserName(decoded.name || decoded.email || "User");
        fetchTasks();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) navigate("/");
    }, []);


    const addTask = async (e) => {
        e.preventDefault();
        await API.post("/tasks", { title, description, priority, deadline });
        setTitle("");
        setDescription("");
        setPriority("Medium");
        setDeadline("");
        fetchTasks();
    };

    const deleteTask = async (id) => {
        await API.delete(`/tasks/${id}`);
        fetchTasks();
    };

    const toggleStatus = async (id) => {
        await API.patch(`/tasks/${id}/toggle`);
        fetchTasks();
    };

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };


    const filteredTasks = tasks.filter(
        (t) => filter === "All" || t.status === filter
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-10 animate-fade">
            <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur shadow-2xl rounded-2xl p-6 transition-all duration-500 hover:shadow-indigo-300">

                <div className="flex justify-between items-center mb-4 animate-slide">
                    <div>
                        <h1 className="text-2xl font-bold">My Tasks</h1>
                        <p className="text-sm text-gray-600">
                            Welcome, <span className="font-semibold">{userName}</span> 👋
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <select
                            className="border rounded px-3 py-1"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="All">All</option>
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                        </select>

                        <button
                            onClick={logout}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 hover:cursor-pointer transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>


                {/* ADD TASK FORM */}
                <form onSubmit={addTask} className="grid grid-cols-5 gap-2 mb-6 animate-slide">
                    <input
                        className="border rounded px-3 py-2"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <input
                        className="border rounded px-3 py-2"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <select
                        className="border rounded px-3 py-2"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                    >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                    </select>

                    <input
                        type="date"
                        className="border rounded px-3 py-2"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                    />

                    <button className="bg-indigo-500 text-white rounded hover:bg-indigo-600 transition hover:cursor-pointer hover:scale-105">
                        Add
                    </button>
                </form>

                {/* TASK LIST */}
                <ul className="space-y-3">
                    {filteredTasks.map((task) => (
                        <li
                            key={task._id}
                            className="flex justify-between items-center border rounded-lg px-4 py-3 bg-white shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-300 animate-card"
                        >
                            <div>
                                <p className="font-semibold">{task.title}</p>
                                <p className="text-sm text-gray-500">{task.description}</p>

                                <div className="flex gap-2 mt-1 text-xs">
                                    <span
                                        className={`px-2 py-1 rounded ${task.priority === "High"
                                            ? "bg-red-200"
                                            : task.priority === "Medium"
                                                ? "bg-yellow-200"
                                                : "bg-green-200"
                                            }`}
                                    >
                                        {task.priority}
                                    </span>

                                    {task.deadline && (
                                        <span className="bg-blue-100 px-2 py-1 rounded">
                                            Due: {new Date(task.deadline).toLocaleDateString()}
                                        </span>
                                    )}

                                    <span
                                        className={`px-2 py-1 rounded ${task.status === "Completed"
                                            ? "bg-green-200"
                                            : "bg-gray-200"
                                            }`}
                                    >
                                        {task.status}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => toggleStatus(task._id)}
                                    className="text-green-600 hover:underline text-sm transition hover:scale-110 hover:cursor-pointer"
                                >
                                    {task.status === "Pending" ? "Mark Done" : "Undo"}
                                </button>

                                <button
                                    onClick={() => deleteTask(task._id)}
                                    className="text-red-500 hover:underline text-sm transition hover:scale-110 hover:cursor-pointer"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );

}

export default Dashboard;
