"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { HabitForm } from "@/components/HabitForm";
import { HabitList } from "@/components/HabitList";
import { getAuthSession, logout } from "@/lib/auth";
import { getHabits, updateHabit } from "@/lib/storage";
import { toggleHabitCompletion, deleteHabitWithId } from "@/lib/habits";
import { Habit } from "@/types/habit";

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentSession = getAuthSession();
    if (currentSession) {
      setSession(currentSession);
      setHabits(getHabits().filter((h) => h.userId === currentSession.userId));
      setIsLoading(false);
    }
  }, []);

  const handleFormSuccess = (habit: Habit) => {
    setHabits(getHabits().filter((h) => h.userId === session.userId));
    setShowForm(false);
    setEditingHabit(undefined);
  };

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleDelete = (habitId: string) => {
    if (confirm("Are you sure you want to delete this habit?")) {
      deleteHabitWithId(habitId, true);
      setHabits(getHabits().filter((h) => h.userId === session.userId));
    }
  };

  const handleToggle = (habit: Habit, date: string) => {
    const updated = toggleHabitCompletion(habit, date);
    updateHabit(updated);
    setHabits(getHabits().filter((h) => h.userId === session.userId));
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <main
        data-testid="dashboard-page"
        className="min-h-screen bg-gray-50 p-4 md:p-8"
      >
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold">Habit Tracker</h1>
              <p className="text-gray-600">{session?.email}</p>
            </div>
            <button
              data-testid="logout-button"
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>

          {showForm ? (
            <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
              <HabitForm
                userId={session.userId}
                habit={editingHabit}
                onSuccess={handleFormSuccess}
                onCancel={() => {
                  setShowForm(false);
                  setEditingHabit(undefined);
                }}
              />
            </div>
          ) : (
            <button
              data-testid="new-habit-button"
              onClick={() => setShowForm(true)}
              className="w-full mb-8 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              + New Habit
            </button>
          )}

          <HabitList
            userId={session.userId}
            habits={habits}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggle={handleToggle}
          />
        </div>
      </main>
    </ProtectedRoute>
  );
}
