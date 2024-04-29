// stores/favoriteStore.ts
import { defineStore } from 'pinia'

export const useLaunchStore = defineStore('favorite', {
	state: () => ({
		favorites: [] as String[], // Array of launch IDs
		name: 'Ali',
	}),
	actions: {
		addToFavorites(id: String) {
			if (!this.favorites.includes(id)) {
				this.favorites.push(id)
			}
		},
		removeFromFavorites(id: String) {
			const index = this.favorites.indexOf(id)
			if (index !== -1) {
				this.favorites.splice(index, 1)
			}
		},
	},
	getters: {
		isFavorite: (state) => (id: String) => {
			return state.favorites.includes(id)
		},
	},
})
