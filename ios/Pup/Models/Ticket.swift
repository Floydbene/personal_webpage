import Foundation

struct Ticket: Codable, Identifiable {
    let id: String
    let userId: String
    var title: String
    var completed: Bool
    var status: String
    var priority: String
    var description: String?
    var dueDate: Date?
    var closedAt: Date?
    var createdBy: String?
    var completedBy: String?
    var assignedTo: String?
    let createdAt: Date
    var updatedAt: Date

    enum CodingKeys: String, CodingKey {
        case id, title, completed, status, priority, description
        case userId = "user_id"
        case dueDate = "due_date"
        case closedAt = "closed_at"
        case createdBy = "created_by"
        case completedBy = "completed_by"
        case assignedTo = "assigned_to"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }
}

struct CreateTicketPayload: Encodable {
    let userId: String
    let title: String
    let status: String
    let createdBy: String
    var description: String?
    var priority: String?
    var assignedTo: String?
    var dueDate: String?

    enum CodingKeys: String, CodingKey {
        case title, description, priority, status
        case userId = "user_id"
        case createdBy = "created_by"
        case assignedTo = "assigned_to"
        case dueDate = "due_date"
    }
}

struct UpdateTicketPayload: Encodable {
    var title: String?
    var description: String?
    var status: String?
    var priority: String?
    var completed: Bool?
    var assignedTo: String?
    var dueDate: String?
    var closedAt: String?
    var completedBy: String?
    var updatedAt: String?

    enum CodingKeys: String, CodingKey {
        case title, description, status, priority, completed
        case assignedTo = "assigned_to"
        case dueDate = "due_date"
        case closedAt = "closed_at"
        case completedBy = "completed_by"
        case updatedAt = "updated_at"
    }
}
