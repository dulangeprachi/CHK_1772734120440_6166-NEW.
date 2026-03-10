import { ArrowLeft, Bell, Plus, Trash2, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface Reminder {
  id: number;
  medicine: string;
  time: string;
  days: string[];
  active: boolean;
}

const defaultReminders: Reminder[] = [
  {
    id: 1,
    medicine: "Paracetamol 500mg",
    time: "08:00",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    active: true,
  },
  {
    id: 2,
    medicine: "Vitamin D",
    time: "13:00",
    days: ["Mon", "Wed", "Fri"],
    active: true,
  },
];

const allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const ReminderScreen = () => {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState<Reminder[]>(defaultReminders);
  const [showAdd, setShowAdd] = useState(false);

  const toggleReminder = (id: number) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
  };

  const deleteReminder = (id: number) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const addReminder = () => {
    const newReminder: Reminder = {
      id: Date.now(),
      medicine: "New Medicine",
      time: "09:00",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      active: true,
    };
    setReminders((prev) => [...prev, newReminder]);
    setShowAdd(false);
  };

  return (
    <div className="app-shell flex flex-col pb-28 px-5 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-muted p-3 rounded-xl"
            aria-label="Go back"
          >
            <ArrowLeft size={28} className="text-foreground" />
          </button>
          <div className="flex items-center gap-3">
            <Bell size={28} className="text-primary" />
            <h1 className="text-senior-xl font-display font-bold text-foreground">
              Reminders
            </h1>
          </div>
        </div>
        <button
          onClick={addReminder}
          className="bg-primary text-primary-foreground p-3 rounded-xl"
          aria-label="Add reminder"
        >
          <Plus size={28} />
        </button>
      </div>

      {/* Reminders List */}
      <div className="space-y-4">
        <AnimatePresence>
          {reminders.map((reminder, i) => (
            <motion.div
              key={reminder.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-card rounded-2xl p-5 border-2 shadow-sm transition-colors ${
                reminder.active ? "border-primary/30" : "border-border opacity-60"
              }`}
            >
              {/* Top Row */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-senior-lg font-display font-bold text-foreground">
                  {reminder.medicine}
                </h3>
                {/* Toggle */}
                <button
                  onClick={() => toggleReminder(reminder.id)}
                  className={`w-16 h-9 rounded-full flex items-center transition-colors p-1 ${
                    reminder.active ? "bg-primary" : "bg-muted"
                  }`}
                  role="switch"
                  aria-checked={reminder.active}
                  aria-label={`Toggle ${reminder.medicine} reminder`}
                >
                  <motion.div
                    layout
                    className={`w-7 h-7 rounded-full ${
                      reminder.active ? "bg-primary-foreground" : "bg-muted-foreground/40"
                    }`}
                    style={{ marginLeft: reminder.active ? "auto" : 0 }}
                  />
                </button>
              </div>

              {/* Time */}
              <div className="flex items-center gap-3 mb-4">
                <Clock size={24} className="text-secondary" />
                <span className="text-senior-2xl font-display font-900 text-foreground">
                  {reminder.time}
                </span>
              </div>

              {/* Days */}
              <div className="flex gap-2 mb-4">
                {allDays.map((day) => (
                  <div
                    key={day}
                    className={`flex-1 py-2 rounded-lg text-center text-sm font-bold transition-colors ${
                      reminder.days.includes(day)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Delete */}
              <button
                onClick={() => deleteReminder(reminder.id)}
                className="flex items-center gap-2 text-destructive text-senior-sm font-semibold"
              >
                <Trash2 size={20} />
                Delete Reminder
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {reminders.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Bell size={64} className="text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-senior-lg font-display font-bold text-muted-foreground">
            No reminders yet
          </p>
          <p className="text-senior-base text-muted-foreground">
            Tap + to add a medicine reminder
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ReminderScreen;
