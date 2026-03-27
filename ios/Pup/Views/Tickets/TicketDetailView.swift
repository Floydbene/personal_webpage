import SwiftUI

struct TicketDetailView: View {
    let ticket: Ticket
    let users: [UserListItem]
    let displayName: (String?) -> String
    let onUpdate: (UpdateTicketPayload) async -> Void
    let onDelete: () async -> Void

    @Environment(\.appTheme) private var theme
    @Environment(\.dismiss) private var dismiss

    @State private var title: String
    @State private var description: String
    @State private var status: String
    @State private var priority: String
    @State private var assignedTo: String
    @State private var dueDate: Date?
    @State private var hasDueDate: Bool
    @State private var showDeleteConfirm = false

    init(
        ticket: Ticket,
        users: [UserListItem],
        displayName: @escaping (String?) -> String,
        onUpdate: @escaping (UpdateTicketPayload) async -> Void,
        onDelete: @escaping () async -> Void
    ) {
        self.ticket = ticket
        self.users = users
        self.displayName = displayName
        self.onUpdate = onUpdate
        self.onDelete = onDelete
        self._title = State(initialValue: ticket.title)
        self._description = State(initialValue: ticket.description ?? "")
        self._status = State(initialValue: ticket.status)
        self._priority = State(initialValue: ticket.priority)
        self._assignedTo = State(initialValue: ticket.assignedTo ?? "")
        self._dueDate = State(initialValue: ticket.dueDate)
        self._hasDueDate = State(initialValue: ticket.dueDate != nil)
    }

    private var statusSteps: [(String, String)] {
        [("open", "Open"), ("in_progress", "In Progress"), ("done", "Done"), ("closed", "Closed")]
    }

    private var currentStepIndex: Int {
        statusSteps.firstIndex(where: { $0.0 == status }) ?? 0
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    // Title + Description Section
                    VStack(alignment: .leading, spacing: 12) {
                        sectionHeader("Title")
                        TextField("Title", text: $title)
                            .foregroundStyle(theme.text)
                            .padding(10)
                            .background(theme.backgroundSecondary, in: RoundedRectangle(cornerRadius: 8))

                        sectionHeader("Description")
                        TextField("Add a description...", text: $description, axis: .vertical)
                            .lineLimit(3...6)
                            .foregroundStyle(theme.text)
                            .padding(10)
                            .background(theme.backgroundSecondary, in: RoundedRectangle(cornerRadius: 8))
                    }
                    .padding(16)
                    .premiumCard()

                    // Status + Priority Section
                    VStack(alignment: .leading, spacing: 12) {
                        sectionHeader("Status")
                        statusProgressIndicator

                        Picker("Status", selection: $status) {
                            Text("Open").tag("open")
                            Text("In Progress").tag("in_progress")
                            Text("Done").tag("done")
                            Text("Closed").tag("closed")
                        }
                        .pickerStyle(.menu)
                        .tint(theme.primary)

                        Divider()
                            .overlay(theme.border.opacity(0.5))

                        sectionHeader("Priority")
                        Picker("Priority", selection: $priority) {
                            Text("Low").tag("low")
                            Text("Medium").tag("medium")
                            Text("High").tag("high")
                            Text("Urgent").tag("urgent")
                        }
                        .pickerStyle(.menu)
                        .tint(theme.primary)
                    }
                    .padding(16)
                    .premiumCard()

                    // Assignee Section
                    VStack(alignment: .leading, spacing: 12) {
                        sectionHeader("Assignee")
                        Picker("Assignee", selection: $assignedTo) {
                            Text("Unassigned").tag("")
                            ForEach(users, id: \.email) { user in
                                Text(user.displayName ?? user.email.components(separatedBy: "@").first ?? user.email)
                                    .tag(user.email)
                            }
                        }
                        .pickerStyle(.menu)
                        .tint(theme.primary)
                    }
                    .padding(16)
                    .premiumCard()

                    // Due Date Section
                    VStack(alignment: .leading, spacing: 12) {
                        Toggle(isOn: $hasDueDate) {
                            sectionHeader("Due Date")
                        }
                        .tint(theme.primary)

                        if hasDueDate {
                            DatePicker(
                                "Due",
                                selection: Binding(
                                    get: { dueDate ?? Date() },
                                    set: { dueDate = $0 }
                                ),
                                displayedComponents: .date
                            )
                            .datePickerStyle(.compact)
                            .tint(theme.primary)
                        }
                    }
                    .padding(16)
                    .premiumCard()

                    // Metadata Section
                    VStack(alignment: .leading, spacing: 8) {
                        sectionHeader("Details")

                        HStack(spacing: 4) {
                            Image(systemName: "clock")
                                .font(.caption2)
                                .foregroundStyle(theme.textMuted)
                            Text("Created \(ticket.createdAt.timeAgo)")
                            if let createdBy = ticket.createdBy {
                                Text("by \(displayName(createdBy))")
                            }
                        }
                        .font(.caption)
                        .foregroundStyle(theme.textMuted)

                        if let closedAt = ticket.closedAt {
                            HStack(spacing: 4) {
                                Image(systemName: "checkmark.circle")
                                    .font(.caption2)
                                    .foregroundStyle(theme.textMuted)
                                Text("Closed \(closedAt.timeAgo)")
                                if let completedBy = ticket.completedBy {
                                    Text("by \(displayName(completedBy))")
                                }
                            }
                            .font(.caption)
                            .foregroundStyle(theme.textMuted)
                        }
                    }
                    .padding(16)
                    .premiumCard()

                    // Delete Section
                    Button(role: .destructive) {
                        showDeleteConfirm = true
                    } label: {
                        HStack {
                            Image(systemName: "trash")
                            Text("Delete Ticket")
                        }
                        .frame(maxWidth: .infinity)
                        .padding(12)
                    }
                    .foregroundStyle(Color(hex: "#ef4444"))
                    .padding(4)
                    .background(Color(hex: "#ef4444").opacity(0.08), in: RoundedRectangle(cornerRadius: 14))
                    .overlay(
                        RoundedRectangle(cornerRadius: 14)
                            .stroke(Color(hex: "#ef4444").opacity(0.2), lineWidth: 0.5)
                    )
                }
                .padding()
            }
            .background(theme.background)
            .navigationTitle("Edit Ticket")
            .navigationBarTitleDisplayMode(.inline)
            .toolbarBackground(theme.cardBackground, for: .navigationBar)
            .toolbarColorScheme(theme.id == "light" ? .light : .dark, for: .navigationBar)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                        .foregroundStyle(theme.textMuted)
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        Task {
                            var payload = UpdateTicketPayload()
                            if title != ticket.title { payload.title = title }
                            let desc = description.trimmingCharacters(in: .whitespacesAndNewlines)
                            if desc != (ticket.description ?? "") {
                                payload.description = desc.isEmpty ? nil : desc
                            }
                            if status != ticket.status { payload.status = status }
                            if priority != ticket.priority { payload.priority = priority }
                            let newAssignee = assignedTo.isEmpty ? nil : assignedTo
                            if newAssignee != ticket.assignedTo { payload.assignedTo = newAssignee }
                            if hasDueDate, let d = dueDate {
                                payload.dueDate = d.dateInputString
                            } else if !hasDueDate && ticket.dueDate != nil {
                                payload.dueDate = ""
                            }
                            await onUpdate(payload)
                            dismiss()
                        }
                    }
                    .fontWeight(.semibold)
                    .foregroundStyle(theme.primary)
                }
            }
            .alert("Delete Ticket?", isPresented: $showDeleteConfirm) {
                Button("Delete", role: .destructive) {
                    Task {
                        await onDelete()
                        dismiss()
                    }
                }
                Button("Cancel", role: .cancel) {}
            } message: {
                Text("This action cannot be undone.")
            }
        }
    }

    // MARK: - Section Header

    private func sectionHeader(_ text: String) -> some View {
        Text(text)
            .font(.caption)
            .foregroundStyle(theme.textMuted)
            .fontWeight(.semibold)
    }

    // MARK: - Status Progress Indicator

    private var statusProgressIndicator: some View {
        HStack(spacing: 0) {
            ForEach(Array(statusSteps.enumerated()), id: \.offset) { index, step in
                let isPast = index <= currentStepIndex
                let isCurrent = index == currentStepIndex

                // Circle
                VStack(spacing: 4) {
                    Circle()
                        .fill(isPast ? theme.primary : theme.border.opacity(0.5))
                        .frame(width: isCurrent ? 14 : 10, height: isCurrent ? 14 : 10)
                        .overlay {
                            if isCurrent {
                                Circle()
                                    .stroke(theme.primary.opacity(0.3), lineWidth: 2)
                                    .frame(width: 20, height: 20)
                            }
                        }
                    Text(step.1)
                        .font(.system(size: 9))
                        .foregroundStyle(isPast ? theme.text : theme.textMuted)
                        .fontWeight(isCurrent ? .semibold : .regular)
                }
                .frame(maxWidth: .infinity)

                // Line connector
                if index < statusSteps.count - 1 {
                    Rectangle()
                        .fill(index < currentStepIndex ? theme.primary : theme.border.opacity(0.3))
                        .frame(height: 2)
                        .frame(maxWidth: .infinity)
                        .offset(y: -8)
                }
            }
        }
        .padding(.vertical, 8)
    }
}
