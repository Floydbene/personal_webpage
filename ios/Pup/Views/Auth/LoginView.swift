import SwiftUI

struct LoginView: View {
    @Environment(AuthManager.self) private var auth
    @Environment(\.appTheme) private var theme
    @State private var email = ""
    @State private var password = ""
    @State private var isSubmitting = false

    var body: some View {
        VStack(spacing: 32) {
            Spacer()

            // Logo area
            VStack(spacing: 8) {
                Image(systemName: "pawprint.fill")
                    .font(.system(size: 48))
                    .foregroundStyle(theme.accent)

                Text("Pup")
                    .font(.largeTitle)
                    .fontWeight(.light)
                    .foregroundStyle(theme.text)
                    .tracking(4)
            }

            // Form
            VStack(spacing: 16) {
                TextField("Email", text: $email)
                    .textContentType(.emailAddress)
                    .textInputAutocapitalization(.never)
                    .keyboardType(.emailAddress)
                    .autocorrectionDisabled()
                    .padding(14)
                    .background(theme.cardBackground, in: RoundedRectangle(cornerRadius: 10))
                    .overlay(RoundedRectangle(cornerRadius: 10).stroke(theme.border, lineWidth: 1))
                    .foregroundStyle(theme.text)

                SecureField("Password", text: $password)
                    .textContentType(.password)
                    .padding(14)
                    .background(theme.cardBackground, in: RoundedRectangle(cornerRadius: 10))
                    .overlay(RoundedRectangle(cornerRadius: 10).stroke(theme.border, lineWidth: 1))
                    .foregroundStyle(theme.text)

                if let error = auth.error {
                    Text(error)
                        .font(.caption)
                        .foregroundStyle(Color(hex: "#ef4444"))
                        .multilineTextAlignment(.center)
                }

                Button {
                    isSubmitting = true
                    Task {
                        await auth.signIn(email: email, password: password)
                        isSubmitting = false
                    }
                } label: {
                    Group {
                        if isSubmitting {
                            ProgressView()
                                .tint(.white)
                        } else {
                            Text("Sign In")
                                .fontWeight(.semibold)
                        }
                    }
                    .frame(maxWidth: .infinity)
                    .padding(14)
                    .background(theme.primary, in: RoundedRectangle(cornerRadius: 10))
                    .foregroundStyle(.white)
                }
                .disabled(email.isEmpty || password.isEmpty || isSubmitting)
                .opacity(email.isEmpty || password.isEmpty ? 0.5 : 1)
            }
            .padding(.horizontal, 24)

            Spacer()
            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(theme.background)
    }
}
