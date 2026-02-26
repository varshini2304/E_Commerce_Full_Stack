const AdminLoginPage = () => (
  <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-start justify-center px-4 py-16 sm:px-6 lg:px-8">
    <section className="w-full max-w-4xl rounded-[2rem] border border-white/40 bg-[radial-gradient(circle_at_top,#f4f5ff,#eaecff_55%,#e5e7fd)] px-6 py-14 shadow-[0_25px_80px_rgba(56,68,122,0.2)] sm:px-10">
      <div className="mx-auto max-w-[560px] text-center">
        <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-xl">
          <svg className="h-14 w-14 text-[#3c57b8]" fill="none" viewBox="0 0 24 24">
            <path
              d="m4 12 8-6 8 6v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-7Z"
              fill="currentColor"
              opacity="0.2"
            />
            <path
              d="m4 12 8-6 8 6M7 19l5-4 5 4"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </div>

        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-[#3b466f]">Admin Login</h1>
        <p className="mt-2 text-3xl text-[#68729b]">Sign in to your account</p>

        <form className="mt-8 rounded-2xl border border-[#e2e7fb] bg-white/70 p-5 text-left shadow-sm sm:p-7">
          <label className="block text-2xl font-medium text-[#58628d]" htmlFor="admin-email">
            Email
          </label>
          <div className="mt-2 flex h-12 items-center rounded-xl border border-[#d6dcf8] bg-[#f8f9ff] px-4">
            <svg className="h-5 w-5 text-[#9aa3ca]" fill="none" viewBox="0 0 24 24">
              <path
                d="M4 7h16v10H4V7Zm0 0 8 6 8-6"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <input
              className="h-full w-full border-none bg-transparent px-3 text-lg text-[#3f4a75] placeholder:text-[#aab2d1] focus:outline-none"
              id="admin-email"
              name="email"
              placeholder="Email"
              type="email"
            />
          </div>

          <label
            className="mt-5 block text-2xl font-medium text-[#58628d]"
            htmlFor="admin-password"
          >
            Password
          </label>
          <div className="mt-2 flex h-12 items-center rounded-xl border border-[#d6dcf8] bg-[#f8f9ff] px-4">
            <svg className="h-5 w-5 text-[#9aa3ca]" fill="none" viewBox="0 0 24 24">
              <path
                d="M7 10V8a5 5 0 0 1 10 0v2M6 10h12v10H6V10Zm6 3v4"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <input
              className="h-full w-full border-none bg-transparent px-3 text-lg text-[#3f4a75] placeholder:text-[#aab2d1] focus:outline-none"
              id="admin-password"
              name="password"
              placeholder="Password"
              type="password"
            />
            <button className="text-sm text-[#9aa3ca]" type="button">
              Show
            </button>
          </div>

          <div className="mt-3 text-right">
            <button className="text-lg text-[#df7d77]" type="button">
              Forgot password?
            </button>
          </div>

          <button
            className="mt-5 h-12 w-full rounded-xl bg-gradient-to-r from-[#2e4db6] to-[#4f6ed7] text-4xl font-semibold text-white"
            type="submit"
          >
            Sign In
          </button>

          <div className="mt-6 flex items-center gap-3 text-center">
            <span className="h-px flex-1 bg-[#e2e6f7]" />
            <p className="flex items-center gap-2 text-lg text-[#6a749d]">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#bae0c2] text-[10px] text-white">
                ✓
              </span>
              Secured by JWT
            </p>
            <span className="h-px flex-1 bg-[#e2e6f7]" />
          </div>
        </form>
      </div>
    </section>
  </div>
);

export default AdminLoginPage;
