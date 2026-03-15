import Foundation

struct UserProfile: Codable {
    let userId: String
    let email: String
    var displayName: String

    enum CodingKeys: String, CodingKey {
        case email
        case userId = "user_id"
        case displayName = "display_name"
    }
}

struct UserListItem: Codable {
    let email: String
    let displayName: String?

    enum CodingKeys: String, CodingKey {
        case email
        case displayName = "display_name"
    }
}

struct UpsertProfilePayload: Encodable {
    let userId: String
    let email: String
    let displayName: String

    enum CodingKeys: String, CodingKey {
        case email
        case userId = "user_id"
        case displayName = "display_name"
    }
}
