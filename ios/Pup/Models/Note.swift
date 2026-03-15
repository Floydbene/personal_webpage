import Foundation

struct Note: Codable, Identifiable {
    let id: String
    let userId: String
    let content: String
    let createdBy: String?
    let createdAt: Date

    enum CodingKeys: String, CodingKey {
        case id, content
        case userId = "user_id"
        case createdBy = "created_by"
        case createdAt = "created_at"
    }
}

struct CreateNotePayload: Encodable {
    let userId: String
    let content: String
    let createdBy: String

    enum CodingKeys: String, CodingKey {
        case content
        case userId = "user_id"
        case createdBy = "created_by"
    }
}
