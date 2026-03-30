document.addEventListener("DOMContentLoaded", () => {
  const baseUrl = "https://69c77edc63393440b316c8e1.mockapi.io/emps/empdetails";
  const tableBody = document.getElementById("employeeTableBody");
  let editId = null;

  const fetchapi = async () => {
    try {
      const res = await axios.get(baseUrl);
      const data = res.data;

      // Clear previous data (optional but good practice)
      tableBody.innerHTML = "";

      // Map data into table rows
      data.forEach((emp) => {
        const row = document.createElement("tr");

        row.innerHTML = `
                    <td>${emp.name}</td>
                    <td>${emp.empcode}</td>
                    <td>${emp.salary}</td>
                    <td>${emp.email}</td>
                    <td>${emp.city}</td>
                    <td>
                        <button class="editbtn">Edit</button>
                        <button class="deletebtn">Delete</button>
                    </td>
                `;

        row.setAttribute("key", `${emp.id}`);
        row.classList.add("item");

        tableBody.appendChild(row);
      });

      const deleteEmployee = () => {
        const dltbtns = document.querySelectorAll(".deletebtn");

        dltbtns.forEach((d) => {
          d.addEventListener("click", (e) => {
            e.preventDefault();
            const empcard = d.closest(".item");
            const empid = empcard.getAttribute("key");
            d.textContent = "Deleting...";
            d.disabled = true;

            const deleteEmp = async () => {
              try {
                await axios.delete(`${baseUrl}/${empid}`);
                await fetchapi();
                Toastify({
                  text: "Deleted successfully",
                  duration: 3000,
                  gravity: "top",
                  position: "right",
                  style: {
                    background: "green",
                  },
                }).showToast();
              } catch (error) {
                console.log(error);

                d.textContent = "Delete";
                d.disabled = false;
              }
            };

            deleteEmp();
          });
        });
      };

      deleteEmployee();

      const editEmployee = () => {
        const editBtns = document.querySelectorAll(".editbtn");

        editBtns.forEach((btn) => {
          btn.addEventListener("click", () => {
            const row = btn.closest(".item");
            const id = row.getAttribute("key");

            const cells = row.children;

            // Fill form with existing data
            document.getElementById("name").value = cells[0].textContent;
            document.getElementById("empCode").value = cells[1].textContent;
            document.getElementById("salary").value = cells[2].textContent;
            document.getElementById("email").value = cells[3].textContent;
            document.getElementById("city").value = cells[4].textContent;

            // store id for update
            editId = id;
            document.querySelector("button[type='submit']").textContent = editId
              ? "Update"
              : "Submit";
          });
        });
      };

      editEmployee();
    } catch (error) {
      console.error(error);
    }
  };

  fetchapi();

  const form = document.getElementById("emp-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const empcode = Number(document.getElementById("empCode").value);
    const salary = document.getElementById("salary").value;
    const email = document.getElementById("email").value;
    const city = document.getElementById("city").value;
    const empobj = {
      name: name,
      empcode: empcode,
      salary: salary,
      email: email,
      city: city,
    };

    const postdata = async () => {
      try {
        if (editId) {
          await axios.put(`${baseUrl}/${editId}`, empobj);
          editId = null;
          Toastify({
            text: "Updated successfully",
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {
              background: "green",
            },
          }).showToast();
        } else {
          await axios.post(baseUrl, empobj);
          Toastify({
            text: "Saved successfully",
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {
              background: "green",
            },
          }).showToast();
        }

        await fetchapi();
        form.reset();
      } catch (error) {
        console.log(error);
      }
    };
    postdata();
  });
});
