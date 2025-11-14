
    const API_URL = "http://localhost:3000/users";
    const tbody = document.querySelector("#employeeTable tbody");
    const modal = document.getElementById("userModal");
    const modalTitle = document.getElementById("modalTitle");
    const saveBtn = document.getElementById("saveBtn");
    const openAddModal = document.getElementById("openAddModal");
    const closeModal = document.getElementById("closeModal");

    
    async function fetchUsers() {
      const res = await fetch(API_URL);
      const data = await res.json();
      renderTable(data);
    }

    function renderTable(data) {
      tbody.innerHTML = "";
      data.forEach(emp => {
        const bonus = Number(emp.bonus.replace(/[^0-9]/g, "")) / 100;
        const deduction = Number(emp.deduction.replace(/[^0-9]/g, "")) / 100;
        const total = emp.salary * (1 + bonus) * (1 - deduction);

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${emp.id}</td>
          <td>${emp.name}</td>
          <td>${emp.email}</td>
          <td>${emp.salary}</td>
          <td>${emp.bonus}</td>
          <td>${emp.deduction}</td>
          <td>${total.toFixed(0)}</td>
          <td>
            <button class="edit-btn" onclick="editUser('${emp.id}')">Sửa</button>
            <button class="delete-btn" onclick="deleteUser('${emp.id}')">Xóa</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    // Mở modal thêm
    openAddModal.onclick = () => {
      modalTitle.textContent = "Thêm nhân viên";
      saveBtn.onclick = addUser;
      modal.style.display = "flex";
      clearForm();
    };

    // Đóng modal
    closeModal.onclick = () => modal.style.display = "none";

    // Lấy dữ liệu form
    function getFormData() {
      return {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        salary: Number(document.getElementById("salary").value),
        bonus: document.getElementById("bonus").value,
        deduction: document.getElementById("deduction").value
      };
    }

    // Xóa dữ liệu form
    function clearForm() {
      ["userId", "name", "email", "salary", "bonus", "deduction"].forEach(id => {
        document.getElementById(id).value = "";
      });
    }

    // Thêm nhân viên
    async function addUser() {
      const newUser = getFormData();
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });
      if (res.ok) {
        modal.style.display = "none";
        fetchUsers();
      }
    }

    // Xóa nhân viên
    async function deleteUser(id) {
      if (!confirm("Bạn có chắc muốn xóa nhân viên này?")) return;
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchUsers();
    }

    // Sửa nhân viên
    async function editUser(id) {
      const res = await fetch(`${API_URL}/${id}`);
      const emp = await res.json();
      modalTitle.textContent = "Sửa nhân viên";
      modal.style.display = "flex";
      document.getElementById("userId").value = emp.id;
      document.getElementById("name").value = emp.name;
      document.getElementById("email").value = emp.email;
      document.getElementById("salary").value = emp.salary;
      document.getElementById("bonus").value = emp.bonus;
      document.getElementById("deduction").value = emp.deduction;
      saveBtn.onclick = () => updateUser(id);
    }

    // Cập nhật nhân viên
    async function updateUser(id) {
      const updatedUser = getFormData();
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser)
      });
      if (res.ok) {
        modal.style.display = "none";
        fetchUsers();
      }
    }

    fetchUsers();
