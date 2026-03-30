import Foundation

enum ShoppingUnit: String, CaseIterable, Identifiable {
    case g, kg, ml, l, oz, lb, cups, tbsp, tsp, pcs

    var id: String { rawValue }

    var label: String {
        switch self {
        case .g: return "g"
        case .kg: return "kg"
        case .ml: return "ml"
        case .l: return "L"
        case .oz: return "oz"
        case .lb: return "lb"
        case .cups: return "cups"
        case .tbsp: return "tbsp"
        case .tsp: return "tsp"
        case .pcs: return "pcs"
        }
    }

    /// Formats a quantity + optional unit for display.
    /// - "220g", "1.5 cups", "x2" (no unit), nothing (qty=1, no unit)
    static func formatQuantity(_ quantity: Double, unit: String?) -> String? {
        let isWhole = quantity == quantity.rounded(.towardZero) && quantity.truncatingRemainder(dividingBy: 1) == 0
        let qtyStr = isWhole ? String(Int(quantity)) : String(format: "%.1f", quantity)

        if let unit = unit, !unit.isEmpty {
            // Compact units (g, kg, ml, l, oz, lb) have no space; others get a space
            let compact = ["g", "kg", "ml", "L", "oz", "lb"]
            let separator = compact.contains(unit) ? "" : " "
            return "\(qtyStr)\(separator)\(unit)"
        } else if quantity > 1 || !isWhole {
            return "x\(qtyStr)"
        }
        return nil
    }
}

struct ShoppingItem: Codable, Identifiable {
    let id: String
    let userId: String
    var name: String
    var store: String?
    var estimatedCost: Double?
    var quantity: Double
    var unit: String?
    var neededBy: String?
    var purchased: Bool
    var purchasedBy: String?
    var purchasedAt: Date?
    let createdBy: String
    let createdAt: Date
    var updatedAt: Date

    enum CodingKeys: String, CodingKey {
        case id, name, store, quantity, unit, purchased
        case userId = "user_id"
        case estimatedCost = "estimated_cost"
        case neededBy = "needed_by"
        case purchasedBy = "purchased_by"
        case purchasedAt = "purchased_at"
        case createdBy = "created_by"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }
}

struct CreateShoppingItemPayload: Encodable {
    let userId: String
    let name: String
    let createdBy: String
    var store: String?
    var estimatedCost: Double?
    var quantity: Double?
    var unit: String?
    var neededBy: String?

    enum CodingKeys: String, CodingKey {
        case name, store, quantity, unit
        case userId = "user_id"
        case createdBy = "created_by"
        case estimatedCost = "estimated_cost"
        case neededBy = "needed_by"
    }
}

struct UpdateShoppingItemPayload: Encodable {
    var name: String?
    var store: String?
    var estimatedCost: Double?
    var quantity: Double?
    var unit: String?
    var neededBy: String?
    var purchased: Bool?
    var purchasedBy: String?
    var purchasedAt: String?
    var updatedAt: String?

    enum CodingKeys: String, CodingKey {
        case name, store, quantity, unit, purchased
        case estimatedCost = "estimated_cost"
        case neededBy = "needed_by"
        case purchasedBy = "purchased_by"
        case purchasedAt = "purchased_at"
        case updatedAt = "updated_at"
    }
}
