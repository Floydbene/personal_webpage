import SwiftUI

struct DayDetailView: View {
    let date: Date
    @Environment(CalendarViewModel.self) private var vm
    @Environment(TicketsViewModel.self) private var ticketsVM
    @Environment(\.appTheme) private var theme
    @Environment(\.dismiss) private var dismiss
    @State private var showCreateBlock = false

    private var dayBlocks: [ScheduleBlock] {
        vm.blocks(for: date)
    }

    private var dayTickets: [Ticket] {
        vm.ticketsDue(on: date)
    }

    private var dateTitle: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "EEEE, MMM d"
        return formatter.string(from: date)
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    if dayBlocks.isEmpty && dayTickets.isEmpty {
                        ContentUnavailableView {
                            Label("Nothing Scheduled", systemImage: "calendar")
                        } description: {
                            Text("No schedule blocks or tasks due on this day.")
                        }
                        .foregroundStyle(theme.textMuted)
                        .padding(.top, 40)
                    } else {
                        // Schedule Blocks
                        if !dayBlocks.isEmpty {
                            VStack(alignment: .leading, spacing: 8) {
                                Text("SCHEDULE BLOCKS")
                                    .font(.caption)
                                    .fontWeight(.semibold)
                                    .foregroundStyle(theme.textMuted)
                                    .padding(.horizontal, 4)

                                ForEach(dayBlocks) { block in
                                    ScheduleBlockRowView(block: block, ticketTitle: ticketTitle(for: block))
                                }
                            }
                        }

                        // Tasks Due
                        if !dayTickets.isEmpty {
                            VStack(alignment: .leading, spacing: 8) {
                                Text("TASKS DUE")
                                    .font(.caption)
                                    .fontWeight(.semibold)
                                    .foregroundStyle(theme.textMuted)
                                    .padding(.horizontal, 4)

                                ForEach(dayTickets) { ticket in
                                    TicketRowView(
                                        ticket: ticket,
                                        displayName: ticketsVM.displayName
                                    )
                                }
                            }
                        }
                    }
                }
                .padding()
            }
            .background(theme.background)
            .navigationTitle(dateTitle)
            .navigationBarTitleDisplayMode(.inline)
            .toolbarBackground(theme.cardBackground, for: .navigationBar)
            .toolbarColorScheme(theme.id == "light" ? .light : .dark, for: .navigationBar)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Done") { dismiss() }
                        .foregroundStyle(theme.textMuted)
                }
                ToolbarItem(placement: .primaryAction) {
                    Button {
                        showCreateBlock = true
                    } label: {
                        Image(systemName: "plus")
                            .fontWeight(.semibold)
                            .foregroundStyle(theme.primary)
                    }
                }
            }
            .sheet(isPresented: $showCreateBlock) {
                CreateScheduleBlockView(initialDate: date)
                    .presentationDragIndicator(.visible)
                    .presentationCornerRadius(20)
            }
        }
    }

    private func ticketTitle(for block: ScheduleBlock) -> String? {
        guard let ticketId = block.ticketId else { return nil }
        return vm.tickets.first(where: { $0.id == ticketId })?.title
            ?? ticketsVM.tickets.first(where: { $0.id == ticketId })?.title
    }
}
