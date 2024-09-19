document.addEventListener("DOMContentLoaded", () => {
  const editButtons = document.querySelectorAll(".edit-btn");

  editButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const form = this.closest("form");
      const input = form.querySelector('input[name="name"]');
      const saveBtn = form.querySelector(".save-btn");

      input.removeAttribute("readonly");
      this.style.display = "none";
      saveBtn.style.display = "inline";
    });
  });

  const editBirthdayButtons = document.querySelectorAll(".edit-birthday-btn");

  editBirthdayButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const form = this.closest("form");
      const input = form.querySelector('input[name="birthday"]');
      const saveBtn = form.querySelector(".save-birthday-btn");

      input.removeAttribute("readonly");
      this.style.display = "none";
      saveBtn.style.display = "inline";
    });
  });
});
