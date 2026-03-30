import SwiftUI

struct CreateScheduleBlockView: View {
    var initialDate: Date?

    @Environment(CalendarViewModel.self) private var vm
    @Environment(TicketsViewModel.self) private var ticketsVM
    @Environment(\.appTheme) private var theme
    @Environment(\.dismiss) private var dismiss

    @State private var title = ""
    @State private var description = ""
    @State private var startDate: Date
    @State private var endDate: Date
    @State private var selectedColor = "#569cd6"
    @State private var selectedTicketId: String = ""

    private let presetColors = [
        "#569cd6", "#22c55e", "#f97316", "#ef4444",
        "#a855f7", "#14b8a6", "#eab308", "#ec4899"
    ]

    init(initialDate: Date? = nil) {
        self.initialDate = initialDate
        let date = initialDate ?? Date()
        self._startDate = State(initialValue: date)
        self._endDate = State(initialValue: date)
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    // Title
                    VStack(alignment: .leading, spacing: 12) {
                        sectionHeader("Title")
                        TextField("Block title", text: $title)
                            .foregroundStyle(theme.text)
                            .padding(10)
                            .background(theme.backgroundSecondary, in: RoundedRectangle(cornerRadius: 8))

                        sectionHeader("Description")
                        TextField("Optional description...", text: $description, axis: .vertical)
                            .lineLimit(3...6)
                            .foregroundStyle(theme.text)
                            .padding(10)
                            .background(theme.backgroundSecondary, in: RoundedRectangle(cornerRadius: 8))
                    }
                    .padding(16)
                    .premiumCard()

                    // Dates
                    VStack(alignment: .leading, spacing: 12) {
                        sectionHeader("Start Date")
                        DatePicker("Start", selection: $startDate, displayedComponents: .date)
                            .datePickerStyle(.compact)
                            .tint(theme.primary)

                        sectionHeader("End Date")
                        DatePicker("End", selection: $endDate, in: startDate..., displayedComponents: .date)
                            .datePickerStyle(.compact)
                            .tint(theme.primary)
                    }
                    .padding(16)
                    .premiumCard()

                    // Color picker
                    VStack(alignment: .leading, spacing: 12) {
                        sectionHeader("Color")
                        HStack(spacing: 10) {
                            ForEach(presetColors, id: \.self) { color in
                                Circle()
                                    .fill(Color(hex: color))
                                    .frame(width: 32, height: 32)
                                    .overlay {
                                        if selectedColor == color {
                                            Circle()
                                                .stroke(.white, lineWidth: 2)
                                                .frame(width: 26, height: 26)
                                        }
                                    }
                                    .onTapGesture {
                                        selectedColor = color
                                    }
                            }
                        }
                    }
                    .padding(16)
                    .premiumCard()

                    // Ticket association
                    VStack(alignment: .leading, spacing: 12) {
                        sectionHeader("Linked Ticket")
                        Picker("Ticket", selection: $selectedTicketId) {
                            Text("None").tag("")
                            ForEach(ticketsVM.tickets) { ticket in
                                Text(ticket.title).tag(ticket.id)
                            }
                        }
                        .pickerStyle(.menu)
                        .tint(theme.primary)
                    }
                    .padding(16)
                    .premiumCard()
                }
                .padding()
            }
            .background(theme.background)
            .navigationTitle("New Schedule Block")
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
                            await vm.createBlock(
                                title: title,
                                startDate: startDate.dateInputString,
                                endDate: endDate.dateInputString,
                                description: description.isEmpty ? nil : description,
                                color: selectedColor,
                                ticketId: selectedTicketId.isEmpty ? nil : selectedTicketId
                            )
                            dismiss()
                        }
                    }
                    .fontWeight(.semibold)
                    .foregroundStyle(theme.primary)
                    .disabled(title.trimmingCharacters(in: .whitespaces).isEmpty)
                }
            }
        }
    }

    private func sectionHeader(_ text: String) -> some View {
        Text(text)
            .font(.caption)
            .foregroundStyle(theme.textMuted)
            .fontWeight(.semibold)
    }
}
