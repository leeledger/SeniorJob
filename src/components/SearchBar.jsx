import styles from './SearchBar.module.css'

export default function SearchBar({ value, onChange, placeholder = '검색' }) {
  return (
    <div className={styles.wrap}>
      <span className={styles.icon}>🔍</span>
      <input
        className={styles.input}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button className={styles.clear} onClick={() => onChange('')}>✕</button>
      )}
    </div>
  )
}
