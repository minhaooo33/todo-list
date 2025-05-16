import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: boolean; 
  deadlineDate?: string;
  deadlineTime?: string;
  comment?: string;
  order: number;
  fileName?: string;
  fileUploadTime?: string;
}

export type Filter = 'myTask' | 'inProgress' | 'completed';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  // 所有待辦列表
  private todosSubject = new BehaviorSubject<Task[]>(this.loadFromStorage());
  todos$ = this.todosSubject.asObservable();

  // 篩選狀態
  private filterSubject = new BehaviorSubject<Filter>('myTask');
  filter$ = this.filterSubject.asObservable();

  // 根據篩選條件回傳過濾後的待辦，high priority 排前面
  filteredTodos$: Observable<Task[]> = combineLatest([this.todos$, this.filter$]).pipe(
    map(([todos, filter]) => {
      let filtered = todos;

      switch (filter) {
        case 'inProgress':
          filtered = todos.filter(t => !t.completed);
          break;
        case 'completed':
          filtered = todos.filter(t => t.completed);
          break;
      }

      // priority 排序：true > false
      return filtered
      .sort((a, b) => {
      if (b.priority !== a.priority) {
      return Number(b.priority) - Number(a.priority);
      }
      return a.order - b.order;
      });
        })
  );

  constructor() {
    // 當 todos 改變時，將資料存到 localStorage
    this.todos$.subscribe(todos => {
      localStorage.setItem('todos', JSON.stringify(todos));
    });
  }

  // 從 localStorage 載入
  private loadFromStorage(): Task[] {
    const raw = localStorage.getItem('todos');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed.map((t: any) => ({
      ...t,
      dueDate: t.dueDate ? new Date(t.dueDate) : undefined
    }));
  }

  //允許一次編輯一個待辦
  private editingTaskIdSubject = new BehaviorSubject<string | null>(null);
  editingTaskId$ = this.editingTaskIdSubject.asObservable();

  // 新增待辦
addTask(task: Task) {
  const current = this.todosSubject.value;
  const maxOrder = current.length > 0 ? Math.max(...current.map(t => t.order)) : 0;
  this.todosSubject.next([...current, { ...task, order: maxOrder + 1 }]);
}

  // 更新待辦
  updateTask(updated: Task) {
    const list = this.todosSubject.value.map(t => t.id === updated.id ? updated : t);
    this.todosSubject.next(list);
  }

  // 設定篩選狀態
  setFilter(filter: Filter) {
    this.filterSubject.next(filter);
  }

  // 設定編輯狀態
  setEditingTaskId(id: string | null) {
  this.editingTaskIdSubject.next(id);
}

  //設定完成狀態
  setTaskCompleted(id: string) {
  const updated = this.todosSubject.value.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  this.todosSubject.next(updated);
}


 // 設定 priority
  setTaskPriority(id: string, priority: boolean) {
    const updated = this.todosSubject.value.map(task =>
      task.id === id ? { ...task, priority } : task
    );
    this.todosSubject.next(updated);
  }

  // 取得目前所有的 todos（同步）
  getTodos(): Task[] {
  return this.todosSubject.value;
}

get currentTasks(): Task[] {
  return this.todosSubject.value;
}

updateTasks(tasks: Task[]) {
  this.todosSubject.next(tasks);
}

// 重新排序任務
reorderTasks(fromIndex: number, toIndex: number) {
  const tasks = [...this.todosSubject.value];
  const [moved] = tasks.splice(fromIndex, 1);
  tasks.splice(toIndex, 0, moved);

  // 重新設定每筆任務的 order
  const reordered = tasks.map((task, index) => ({
    ...task,
    order: index
  }));

  this.todosSubject.next(reordered);
}

}