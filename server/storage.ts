import { users, type User, type InsertUser } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

// Define knowledge base item type
export interface KnowledgeItem {
  id: number;
  content: string;
  createdAt: Date;
}

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Knowledge Base Management
  addKnowledgeItem(content: string): Promise<KnowledgeItem>;
  getAllKnowledgeItems(): Promise<KnowledgeItem[]>;
  clearKnowledgeItems(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private knowledgeBase: Map<number, KnowledgeItem>;
  currentId: number;
  knowledgeId: number;

  constructor() {
    this.users = new Map();
    this.knowledgeBase = new Map();
    this.currentId = 1;
    this.knowledgeId = 1;
    
    // Add initial knowledge base items
    this.addKnowledgeItem("Công ty ABC thành lập năm 2010, chuyên cung cấp phần mềm quản lý bán hàng.");
    this.addKnowledgeItem("Sản phẩm chính gồm phần mềm POS, CRM, và báo cáo tự động.");
    this.addKnowledgeItem("Chính sách bảo hành: 12 tháng với mọi sản phẩm.");
    this.addKnowledgeItem("Hỗ trợ kỹ thuật 24/7 qua hotline 1900-1234.");
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Knowledge base management methods
  async addKnowledgeItem(content: string): Promise<KnowledgeItem> {
    const id = this.knowledgeId++;
    const newItem: KnowledgeItem = {
      id,
      content,
      createdAt: new Date()
    };
    this.knowledgeBase.set(id, newItem);
    return newItem;
  }
  
  async getAllKnowledgeItems(): Promise<KnowledgeItem[]> {
    return Array.from(this.knowledgeBase.values());
  }
  
  async clearKnowledgeItems(): Promise<void> {
    this.knowledgeBase.clear();
    this.knowledgeId = 1;
  }
}

export const storage = new MemStorage();
