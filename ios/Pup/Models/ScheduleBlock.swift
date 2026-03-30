import Foundation

struct ScheduleBlock: Codable, Identifiable {
    let id: String
    let userId: String
    var title: String
    var description: String?
    var startDate: String
    var endDate: String
    var color: String
    var ticketId: String?
    let createdBy: String
    let createdAt: Date
    var updatedAt: Date

    enum CodingKeys: String, CodingKey {
        case id, title, description, color
        case userId = "user_id"
        case startDate = "start_date"
        case endDate = "end_date"
        case ticketId = "ticket_id"
        case createdBy = "created_by"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }

    var startDateParsed: Date? {
        Date.fromDateString(startDate)
    }

    var endDateParsed: Date? {
        Date.fromDateString(endDate)
    }
}

struct CreateScheduleBlockPayload: Encodable {
    let userId: String
    let title: String
    let startDate: String
    let endDate: String
    let createdBy: String
    var description: String?
    var color: String?
    var ticketId: String?

    enum CodingKeys: String, CodingKey {
        case title, description, color
        case userId = "user_id"
        case startDate = "start_date"
        case endDate = "end_date"
        case createdBy = "created_by"
        case ticketId = "ticket_id"
    }
}

struct UpdateScheduleBlockPayload: Encodable {
    var title: String?
    var description: String?
    var startDate: String?
    var endDate: String?
    var color: String?
    var ticketId: String?
    var updatedAt: String?

    enum CodingKeys: String, CodingKey {
        case title, description, color
        case startDate = "start_date"
        case endDate = "end_date"
        case ticketId = "ticket_id"
        case updatedAt = "updated_at"
    }
}
