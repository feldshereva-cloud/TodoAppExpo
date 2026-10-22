import { useRef, useState } from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

type Filter = 'All' | 'Active' | 'Completed';

const filters: Filter[] = ['All', 'Active', 'Completed'];

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState<Filter>('All');
  const nextId = useRef(1);

  const activeCount = tasks.filter((task) => !task.completed).length;
  const visibleTasks = tasks.filter((task) => {
    if (filter === 'Active') return !task.completed;
    if (filter === 'Completed') return task.completed;
    return true;
  });

  function addTask() {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
const task: Task = {
  id: nextId.current++,
  title: trimmedTitle,
  completed: false,
};

setTasks((current) => [task, ...current]);
setTitle('');
Keyboard.dismiss();
  }

  function toggleTask(id: number) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  function deleteTask(id: number) {
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.heading}>Reminders</Text>
            <Text style={styles.subtitle}>
                {activeCount === 0
                  ? 'All caught up.'
                  : activeCount + (activeCount === 1 ? ' task left' : ' tasks left')}
            </Text>
          </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Add a task..."
          placeholderTextColor="#64748B"
          accessibilityLabel="New task"
          returnKeyType="done"
          onSubmitEditing={addTask}
          maxLength={200}
          autoCapitalize="sentences"
        />
        <Pressable
          onPress={addTask}
          disabled={!title.trim()}
          accessibilityRole="button"
          accessibilityLabel="Add task"
          style={({ pressed }) => [
            styles.addButton,
            !title.trim() && styles.disabled,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>

      <View style={styles.filters}>
        {filters.map((item) => (
          <Pressable
            key={item}
            onPress={() => setFilter(item)}
            accessibilityRole="button"
            accessibilityState={{ selected: filter === item }}
            style={({ pressed }) => [
              styles.filterButton,
              filter === item && styles.selectedFilter,
              pressed && styles.pressed,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                filter === item && styles.selectedFilterText,
              ]}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={visibleTasks}
        keyExtractor={(task) => String(task.id)}
        style={styles.list}
        contentContainerStyle={
          visibleTasks.length === 0
            ? styles.emptyList
            : styles.listContent
        }
        keyboardShouldPersistTaps="handled"
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <View style={styles.taskRow}>
            <Pressable
              onPress={() => toggleTask(item.id)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: item.completed }}
              accessibilityLabel={item.title}
              style={({ pressed }) => [
                styles.taskToggle,
                pressed && styles.pressed,
              ]}
            >
              <View
                style={[
                  styles.checkbox,
                  item.completed && styles.checkedCheckbox,
                ]}
              >
                {item.completed && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text
                style={[
                  styles.taskTitle,
                  item.completed && styles.completedTitle,
                ]}
              >
                {item.title}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => deleteTask(item.id)}
              accessibilityRole="button"
              accessibilityLabel={`Delete ${item.title}`}
              style={({ pressed }) => [
                styles.deleteButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyHeading}>
              {filter === 'Completed'
                ? 'No completed tasks'
                : filter === 'Active'
                  ? 'No active tasks'
                  : 'Your list is clear'}
            </Text>
            <Text style={styles.emptyText}>
              {filter === 'Completed'
                ? 'Tasks you complete will appear here.'
                : 'Add a task above to get started.'}
            </Text>
          </View>
        }
      />
    </View>
  </KeyboardAvoidingView>
</SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 28,
    paddingBottom: 24,
    gap: 6,
  },
  heading: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    minWidth: 0,
    minHeight: 50,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    color: '#0F172A',
    fontSize: 16,
  },
  addButton: {
    minHeight: 50,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#2563EB',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.7,
  },
  filters: {
    flexDirection: 'row',
    padding: 4,
    marginTop: 24,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
  },
  filterButton: {
    flex: 1,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 9,
  },
  selectedFilter: {
    backgroundColor: '#FFFFFF',
  },
  filterText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '600',
  },
  selectedFilterText: {
    color: '#1D4ED8',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 60,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingLeft: 14,
    paddingRight: 4,
  },
  taskToggle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 64,
    gap: 12,
    paddingVertical: 14,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#94A3B8',
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedCheckbox: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  taskTitle: {
    flex: 1,
    color: '#0F172A',
    fontSize: 16,
    lineHeight: 23,
  },
  completedTitle: {
    color: '#64748B',
    textDecorationLine: 'line-through',
  },
  deleteButton: {
    minWidth: 64,
    minHeight: 48,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: '600',
  },
  separator: {
    height: 10,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 8,
  },
  emptyHeading: {
    color: '#334155',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyText: {
    color: '#64748B',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
});