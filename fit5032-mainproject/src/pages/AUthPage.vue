<template>
  <section class="row justify-content-center">
    <div class="col-12 col-md-6 col-lg-5">
      <h2 class="mb-3">Login / Sign up</h2>

      <!-- 表单先放占位，下一步做 B.1 验证 -->
      <form novalidate>
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input type="email" class="form-control" placeholder="you@example.com" />
        </div>
        <div class="mb-3">
          <label class="form-label">Password</label>
          <input type="password" class="form-control" placeholder="••••••••" />
        </div>
        <button type="submit" class="btn btn-primary w-100">Continue</button>
      </form>

      <div class="text-center mt-3">
        <button class="btn btn-outline-secondary w-100">Continue with Google</button>
      </div>
    </div>
  </section>
</template>
