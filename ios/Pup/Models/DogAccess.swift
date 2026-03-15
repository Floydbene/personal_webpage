import Foundation

struct DogAccessResponse: Codable {
    let hasAccess: Bool
    let currentHolder: String?
    let windowEnd: String?

    enum CodingKeys: String, CodingKey {
        case hasAccess, currentHolder, windowEnd
    }

    var windowEndDate: Date? {
        guard let windowEnd else { return nil }
        let iso = ISO8601DateFormatter()
        iso.formatOptions = [.withInternetDateTime]
        return iso.date(from: windowEnd)
    }
}
