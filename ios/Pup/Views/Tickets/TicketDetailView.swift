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

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    // Title
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Title")
                            .font(.caption)
                            .foregroundStyle(theme.textMuted)
                        TextField("Title", text: $title)
                            .foregroundStyle(theme.text)
                            .padding(10)
                            .background(theme.backgroundSecondary, in: RoundedRectangle(cornerRadius: 8))
                    }

                    // Description
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Description")
                            .font(.caption)
                            .foregroundStyle(theme.textMuted)
                        TextField("Add a description...", text: $description, axis: .vertical)
                            .lineLimit(3...6)
                            .foregroundStyle(theme.text)
                            .padding(10)
                            .background(theme.backgroundSecondary, in: RoundedRectangle(cornerRadius: 8))
                    }

                    // Status + Priority
                    HStack(spacing: 16) {
                        VStack(alignment: .leading, spacing: 4) {
                            Text("Status")
                                .font(.caption)
                                .foregroundStyle(theme.textMuted)
                            Picker("Status", selection: $status) {
                                Text("Open").tag("open")
                                Text("In Progress").tag("in_progress")
                                Text("Done").tag("done")
                                Text("Closed").tag("closed")
                            }
                            .pickerStyle(.menu)
                            .tint(theme.primary)
                        }

                        VStack(alignment: .leading, spacing: 4) {
                            Text("Priority")
                                .font(.caption)
                                .foregroundStyle(theme.textMuted)
                            Picker("Priority", selection: $priority) {
                                Text("Low").tag("low")
                                Text("Medium").tag("medium")
                                Text("High").tag("high")
                                Text("Urgent").tag("urgent")
                            }
                            .pickerStyle(.menu)
                            .tint(theme.primary)
                        }
                    }

                    // Assignee
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Assignee")
                            .font(.caption)
                            .foregroundStyle(theme.textMuted)
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

                    // Due Date
                    VStack(alignment: .leading, spacing: 4) {
                        Toggle(isOn: $hasDueDate) {
                            Text("Due Date")
                                .font(.caption)
                                .foregroundStyle(theme.textMuted)
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

                    // Info
                    VStack(alignment: .leading, spacing: 4) {
                        HStack(spacing: 4) {
                            Text("Created \(ticket.createdAt.timeAgo)")
                            if let createdBy = ticket.createdBy {
                                Text("by \(displayName(createdBy))")
                            }
                        }
                        .font(.caption)
                        .foregroundStyle(theme.textMuted)

                        if let closedAt = ticket.closedAt {
                            HStack(spacing: 4) {
                                Text("Closed \(closedAt.timeAgo)")
                                if let completedBy = ticket.completedBy {
                                    Text("by \(displayName(completedBy))")
                                }
                            }
                            .font(.caption)
                            .foregroundStyle(theme.textMuted)
                        }
                    }

                    // Delete
                    Button(role: .destructive) {
                        showDeleteConfirm = true
                    } label: {
                        HStack {
                            Image(systemName: "trash")
                            Text("Delete Ticket")
                        }
                        .frame(maxWidth: .infinity)
                        .padding(12)
                        .background(Color(hex: "#ef4444").opacity(0.1), in: RoundedRectangle(cornerRadius: 8))
                    }
                    .foregroundStyle(Color(hex: "#ef4444"))
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
}
