<template>
	<div class="rocket-details">
		<div v-if="rocket" class="rocket-info">
			<h2 class="rocket-name">{{ rocket.name }}</h2>
			<h2 class="rocket-name">Id: {{ rocketId }}</h2>
			<div class="rocket-description">
				<p>Description: {{ rocket.description }}</p>
			</div>
			<div class="rocket-stats">
				<div class="rocket-stat">
					<p>First Flight: {{ rocket.first_flight }}</p>
				</div>
				<div class="rocket-stat">
					<p>Height: {{ rocket.height.meters }} meters</p>
				</div>
				<div class="rocket-stat">
					<p>Diameter: {{ rocket.diameter.meters }} meters</p>
				</div>
				<div class="rocket-stat">
					<p>Mass: {{ rocket.mass.kg }} kg</p>
				</div>
				<div class="rocket-stat">
					<p>Stages: {{ rocket.stages }}</p>
				</div>
			</div>
		</div>
		<div v-else>
			<p>Loading...</p>
		</div>
	</div>
</template>

<script lang="ts" setup>
// import { useAsyncQuery } from '@nuxtjs/composition-api';
// import { ref, computed } from 'vue';

const query = gql`
	query Rocket($rocketId: ID!) {
		rocket(id: $rocketId) {
			description
			first_flight
			height {
				feet
				meters
			}
			diameter {
				meters
				feet
			}
			mass {
				kg
				lb
			}
			name
			stages
			id
		}
	}
`

interface Height {
	feet: number
	meters: number
}

interface Diameter {
	meters: number
	feet: number
}

interface Mass {
	kg: number
	lb: number
}

const rocketId = '5e9d0d95eda69973a809d1ec' // Replace 'YOUR_ROCKET_ID' with the actual ID you want to pass

const { data } = useAsyncQuery<{
	rocket: {
		description: string
		first_flight: string
		height: Height
		diameter: Diameter
		mass: Mass
		name: string
		stages: number
		id: string
	}
}>(query, { rocketId })

const rocket = computed(() => data?.value?.rocket ?? null)
console.log('Rocket:', rocket)
</script>

<style>
.rocket-details {
	max-width: 600px;
	margin: 0 auto;
	padding: 20px;
	background-color: #f9f9f9;
	border-radius: 10px;
}

.rocket-info {
	text-align: center;
}

.rocket-name {
	font-size: 24px;
	color: #333;
	margin-bottom: 10px;
}

.rocket-description {
	background-color: #fff;
	padding: 10px;
	border-radius: 5px;
	box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
	margin-bottom: 20px;
}

.rocket-stats {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}

.rocket-stat {
	flex: 0 0 48%;
	background-color: #fff;
	padding: 10px;
	border-radius: 5px;
	box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
	margin-bottom: 10px;
}

@media (width <= 600px) {
	.rocket-stat {
		flex-basis: 100%;
	}
}
</style>
