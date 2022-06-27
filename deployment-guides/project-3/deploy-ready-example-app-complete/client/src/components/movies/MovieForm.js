import React from 'react'

function MovieForm({ formdata, errors, handleChange, handleSubmit }) {
  const [inputValue, setInputValue] = React.useState('')

  const handleAddStaring = () => {
    handleChange({
      target: { value: [...formdata.starring, inputValue], name: 'starring' }
    })
    setInputValue('')
  }

  const handleRemoveStaring = star => {
    const starring = formdata.starring.filter(name => name !== star)
    handleChange({
      target: { value: starring, name: 'starring' }
    })
  }

  return (
    <div className="columns">
      <form className="column is-10 is-offset-1 box" onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">Title</label>
          <div className="control">
            <input
              className={`input ${errors.title ? 'is-danger' : ''}`}
              placeholder="Name"
              name="title"
              onChange={handleChange}
              value={formdata.title}
            />
          </div>
          {errors.title && <p className="help is-danger">{errors.title}</p>}
        </div>
        <div className="field">
          <label className="label">Year</label>
          <div className="control">
            <input
              className={`input ${errors.year ? 'is-danger' : ''}`}
              placeholder="Release Year"
              name="year"
              type="number"
              onChange={handleChange}
              value={formdata.year}
            />
          </div>
          {errors.year && <p className="help is-danger">{errors.year}</p>}
        </div>
        <div className="field">
          <label className="label">Poster</label>
          <div className="control">
            <input
              className={`input ${errors.poster ? 'is-danger' : ''}`}
              placeholder="Poster Image URL"
              name="poster"
              onChange={handleChange}
              value={formdata.poster}
            />
          </div>
          {errors.poster && <p className="help is-danger">{errors.poster}</p>}
        </div>
        <div className="field">
          <label className="label">Plot Description</label>
          <div className="control">
            <textarea
              className={`textarea ${errors.plotDescription ? 'is-danger' : ''}`}
              placeholder="Plot Description...."
              name="plotDescription"
              onChange={handleChange}
              value={formdata.plotDescription}
            />
          </div>
          {errors.plotDescription && <p className="help is-danger">{errors.plotDescription}</p>}
        </div>
        <div className="field">
          <label className="label">Quote</label>
          <div className="control">
            <input
              className={`input ${errors.quote ? 'is-danger' : ''}`}
              placeholder="Poster Image URL"
              name="quote"
              onChange={handleChange}
              value={formdata.quote}
            />
          </div>
          {errors.quote && <p className="help is-danger">{errors.quote}</p>}
        </div>
        <label className="label">Starring</label>
        <div className="tags has-addons">
          {formdata.starring.map((star, i) => (
            <span key={i} className="tag is-large is-rounded is-danger">
              {star}
              <button
                className="delete"
                onClick={() => handleRemoveStaring(star)}
              />
            </span>
          ))}
        </div>
        <div className="field has-addons">
          <div className="control">
            <input
              className={`input ${errors.poster ? 'is-danger' : ''}`}
              placeholder="Starring.... Add at least 1"
              name="poster"
              onChange={event => setInputValue(event.target.value)}
              value={inputValue}
            />
          </div>
          <div className="control">
            <button
              type="button"
              className="button is-danger"
              disabled={!inputValue}
              onClick={handleAddStaring}
            >
            Add
            </button>
          </div>
        </div>
        {errors.starring && <p className="help is-danger">{errors.starring}</p>}
        <div className="field">
          <label className="checkbox label">
              Is Sequel?
            <input
              type="checkbox"
              name="isSequel"
              onChange={handleChange}
              checked={formdata.isSequel}
            />
          </label>
        </div>
        <div className="field">
          <button type="submit" className="button is-danger is-fullwidth">Make my Movie!</button>
        </div>
      </form>
    </div>
  )
}

export default MovieForm
