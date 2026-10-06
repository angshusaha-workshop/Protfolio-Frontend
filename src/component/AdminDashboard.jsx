import { useEffect, useState } from 'react'

function AdminDashboard() {
  // =========================
  // API URL
  // =========================

  const API_URL =
    import.meta.env.VITE_API_URL ||
    'http://localhost:5000/api'


  // =========================
  // Projects
  // =========================

  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)


  // =========================
  // Form Open / Close
  // =========================

  const [showForm, setShowForm] = useState(false)


  // =========================
  // Editing Project
  // =========================

  const [editingProject, setEditingProject] =
    useState(null)


  // =========================
  // Image
  // =========================

  const [imageFile, setImageFile] = useState(null)
  const [imageUploading, setImageUploading] = useState(false)


  // =========================
  // Form Data
  // =========================

  const [form, setForm] = useState({
    title: '',
    description: '',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
    image: '',
  })


  // =====================================================
  // GET PROJECTS
  // =====================================================

  const fetchProjects = async () => {
    try {
      const response = await fetch(
        `${API_URL}/projects`
      )

      const data = await response.json()

      setProjects(data)
    } catch (error) {
      console.error(
        'Failed to fetch projects:',
        error
      )
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    fetchProjects()
  }, [])


  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const updateField = (event) => {
    setForm({
      ...form,
      [event.target.name]:
        event.target.value,
    })
  }


  // =====================================================
  // IMAGE SELECT
  // =====================================================

  const handleImageChange = (event) => {
    const file = event.target.files[0]

    if (!file) {
      return
    }

    setImageFile(file)
  }


  // =====================================================
  // UPLOAD IMAGE TO CLOUDINARY
  // =====================================================

  const uploadImage = async () => {
    if (!imageFile) {
      return form.image
    }

    setImageUploading(true)

    try {
      const imageFormData = new FormData()

      imageFormData.append(
        'image',
        imageFile
      )

      const response = await fetch(
        `${API_URL}/upload/image`,
        {
          method: 'POST',
          body: imageFormData,
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Image upload failed'
        )
      }

      return data.imageUrl
    } catch (error) {
      throw new Error(
        error.message ||
          'Unable to upload image'
      )
    } finally {
      setImageUploading(false)
    }
  }


  // =====================================================
  // ADD PROJECT
  // =====================================================

  const addProject = async (event) => {
    event.preventDefault()

    try {

      // Upload image first
      const uploadedImageUrl =
        await uploadImage()


      const response = await fetch(
        `${API_URL}/projects`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            title: form.title,

            description:
              form.description,

            technologies:
              form.technologies
                .split(',')
                .map(
                  (technology) =>
                    technology.trim()
                )
                .filter(Boolean),

            githubUrl:
              form.githubUrl,

            liveUrl:
              form.liveUrl,

            image:
              uploadedImageUrl,
          }),
        }
      )


      const data =
        await response.json()


      if (!response.ok) {
        throw new Error(
          data.message ||
            'Failed to add project'
        )
      }


      setProjects([
        ...projects,
        data.project,
      ])


      clearForm()


      alert(
        'Project added successfully.'
      )

    } catch (error) {
      alert(error.message)
    }
  }


  // =====================================================
  // START EDITING
  // =====================================================

  const startEditing = (project) => {

    setEditingProject(project)

    setForm({
      title:
        project.title || '',

      description:
        project.description || '',

      technologies:
        project.technologies
          ?.join(', ') || '',

      githubUrl:
        project.githubUrl || '',

      liveUrl:
        project.liveUrl || '',

      image:
        project.image || '',
    })


    // New image selected হলে
    // সেটা reset হবে
    setImageFile(null)

    setShowForm(true)
  }


  // =====================================================
  // UPDATE PROJECT
  // =====================================================

  const updateProject = async (event) => {
    event.preventDefault()

    try {

      // If new image selected,
      // upload it.
      // Otherwise keep old image.
      let updatedImage =
        form.image

      if (imageFile) {
        updatedImage =
          await uploadImage()
      }


      const response = await fetch(
        `${API_URL}/projects/${editingProject._id}`,
        {
          method: 'PUT',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            title: form.title,

            description:
              form.description,

            technologies:
              form.technologies
                .split(',')
                .map(
                  (technology) =>
                    technology.trim()
                )
                .filter(Boolean),

            githubUrl:
              form.githubUrl,

            liveUrl:
              form.liveUrl,

            image:
              updatedImage,
          }),
        }
      )


      const data =
        await response.json()


      if (!response.ok) {
        throw new Error(
          data.message ||
            'Failed to update project'
        )
      }


      setProjects(
        projects.map((project) =>
          project._id ===
          editingProject._id
            ? data.project
            : project
        )
      )


      clearForm()


      alert(
        'Project updated successfully.'
      )

    } catch (error) {
      alert(error.message)
    }
  }


  // =====================================================
  // DELETE PROJECT
  // =====================================================

  const deleteProject = async (id) => {

    const confirmDelete =
      window.confirm(
        'Are you sure you want to delete this project?'
      )


    if (!confirmDelete) {
      return
    }


    try {

      const response = await fetch(
        `${API_URL}/projects/${id}`,
        {
          method: 'DELETE',
        }
      )


      const data =
        await response.json()


      if (!response.ok) {
        throw new Error(
          data.message ||
            'Failed to delete project'
        )
      }


      setProjects(
        projects.filter(
          (project) =>
            project._id !== id
        )
      )


      alert(
        'Project deleted successfully.'
      )

    } catch (error) {
      alert(error.message)
    }
  }


  // =====================================================
  // CLEAR FORM
  // =====================================================

  const clearForm = () => {

    setForm({
      title: '',
      description: '',
      technologies: '',
      githubUrl: '',
      liveUrl: '',
      image: '',
    })

    setEditingProject(null)

    setImageFile(null)

    setShowForm(false)
  }


  // =====================================================
  // JSX
  // =====================================================

  return (
    <section className="admin-dashboard">

      {/* HEADER */}

      <div className="admin-header">

        <div>

          <p className="eyebrow">
            Admin Panel
          </p>

          <h1>
            Project Management
          </h1>

          <p>
            Manage your portfolio projects
            from one place.
          </p>

        </div>


        <button
          className="admin-add-button"
          onClick={() => {

            if (showForm) {
              clearForm()
              return
            }

            setEditingProject(null)

            setForm({
              title: '',
              description: '',
              technologies: '',
              githubUrl: '',
              liveUrl: '',
              image: '',
            })

            setImageFile(null)

            setShowForm(true)
          }}
        >

          {showForm
            ? 'Close Form'
            : '+ Add Project'}

        </button>

      </div>


      {/* ADD / EDIT FORM */}

      {showForm && (

        <form
          className="project-form"
          onSubmit={
            editingProject
              ? updateProject
              : addProject
          }
        >

          <div className="form-title">

            <p className="eyebrow">
              {editingProject
                ? 'Edit Project'
                : 'New Project'}
            </p>

            <h2>
              {editingProject
                ? 'Update your project'
                : 'Add a project'}
            </h2>

          </div>


          {/* TITLE */}

          <label>

            Project Title

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={updateField}
              placeholder="e.g. Task Management App"
              required
            />

          </label>


          {/* DESCRIPTION */}

          <label>

            Description

            <textarea
              name="description"
              value={form.description}
              onChange={updateField}
              placeholder="Describe your project..."
              rows="5"
              required
            />

          </label>


          {/* TECHNOLOGIES */}

          <label>

            Technologies

            <input
              type="text"
              name="technologies"
              value={form.technologies}
              onChange={updateField}
              placeholder="React, Node.js, MongoDB"
              required
            />

          </label>


          {/* GITHUB */}

          <label>

            GitHub URL

            <input
              type="url"
              name="githubUrl"
              value={form.githubUrl}
              onChange={updateField}
              placeholder="https://github.com/..."
            />

          </label>


          {/* LIVE PROJECT */}

          <label>

            Live Project URL

            <input
              type="url"
              name="liveUrl"
              value={form.liveUrl}
              onChange={updateField}
              placeholder="https://your-project.com"
            />

          </label>


          {/* IMAGE UPLOAD */}

          <label>

            Project Image

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

          </label>


          {/* SELECTED IMAGE NAME */}

          {imageFile && (

            <p>
              Selected image:{' '}
              <strong>
                {imageFile.name}
              </strong>
            </p>

          )}


          {/* CURRENT IMAGE */}

          {form.image && !imageFile && (

            <div>

              <p>
                Current project image:
              </p>

              <img
                src={form.image}
                alt="Current project"
                style={{
                  width: '180px',
                  borderRadius: '12px',
                  marginTop: '10px',
                }}
              />

            </div>

          )}


          {/* SUBMIT */}

          <button
            className="primary-button"
            type="submit"
            disabled={imageUploading}
          >

            {imageUploading
              ? 'Uploading image...'
              : editingProject
                ? 'Update Project ↗'
                : 'Add Project ↗'}

          </button>


          {/* CANCEL */}

          {editingProject && (

            <button
              type="button"
              className="cancel-button"
              onClick={clearForm}
            >
              Cancel
            </button>

          )}

        </form>

      )}


      {/* PROJECT LIST */}

      <div className="admin-projects">

        {loading ? (

          <p>
            Loading projects...
          </p>

        ) : projects.length === 0 ? (

          <p>
            No projects found.
          </p>

        ) : (

          projects.map((project) => (

            <article
              className="admin-project-card"
              key={project._id}
            >

              {/* PROJECT IMAGE */}

              {project.image && (

                <img
                  src={project.image}
                  alt={project.title}
                  style={{
                    width: '180px',
                    height: '120px',
                    objectFit: 'cover',
                    borderRadius: '12px',
                  }}
                />

              )}


              {/* PROJECT INFORMATION */}

              <div className="admin-project-info">

                <span>
                  Project
                </span>

                <h2>
                  {project.title}
                </h2>

                <p>
                  {project.description}
                </p>


                <div className="technology-list">

                  {project.technologies?.map(
                    (
                      technology,
                      index
                    ) => (

                      <span
                        key={index}
                      >
                        {technology}
                      </span>

                    )
                  )}

                </div>

              </div>


              {/* BUTTONS */}

              <div className="admin-project-actions">

                <button
                  onClick={() =>
                    startEditing(project)
                  }
                >
                  Edit
                </button>


                <button
                  className="delete-button"
                  onClick={() =>
                    deleteProject(
                      project._id
                    )
                  }
                >
                  Delete
                </button>

              </div>

            </article>

          ))

        )}

      </div>

    </section>
  )
}

export default AdminDashboard