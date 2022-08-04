const myLoader = () => {
	const loadTime = setTimeout(showPage, 18000)
}

const showPage = () => {
	document.getElementById('loader').style.display="none";
		document.getElementById('loadertext').style.display="none";
		document.getElementById('unloadBody').style.display="block";
}
document.getElementsByTagName("body")[0].addEventListener("load", myLoader());

const tableData = document.getElementsByTagName('tbody')[0];
const modalHolder = document.querySelector('.modal-holder');

const pokemon_types = async () => {
	try {
		const getAllPokemon = await fetch('https://pokeapi.co/api/v2/type/');
		const revealPokemon = await getAllPokemon.json();
		for(const x of revealPokemon.results) {
			let getPokemon = await fetch(x.url)
			let revealPokemon_moves = await getPokemon.json();

			let namesArr = [];
			let imgArr = [];

			for(const j of revealPokemon_moves.pokemon) {
				let poki_info = await fetch(`https://pokeapi.co/api/v2/pokemon/${j.pokemon.name}`);
				let poki_info_url = await poki_info.json();
				namesArr.push(j.pokemon.name);
				if(String(poki_info_url.id)[0] !== 0 && String(poki_info_url.id).length === 2) {
					imgArr.push(`<img src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/${'0'+poki_info_url.id}.png" width="50">`)
				} else if(String(poki_info_url.id)[0] !== 0 && String(poki_info_url.id).length === 1) {
					imgArr.push(`<img src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/${'00'+poki_info_url.id}.png" width="50">`)  
				} else {
					imgArr.push(`<img src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/${poki_info_url.id}.png" width="50">`)
				}
			}

			await Promise.allSettled([namesArr, imgArr])
			.then(() => {
				if(revealPokemon_moves.move_damage_class !== null){
					insertPokeData(x.name, revealPokemon_moves.move_damage_class.name, namesArr, imgArr);
				} else {
					insertPokeData(x.name, "Not Available", namesArr, imgArr);
				}
			})
			
			
		}
	} catch (error) {
		console.log(error)
	}
}

const insertPokeData = (name, class_type, namesArr, imgArr) => {
	let updatedArr = [];
	namesArr.forEach((item,i) => {
		updatedArr.push([namesArr[i], imgArr[i]]);
	})
	let somestring = '';
	for(x = 0; x < updatedArr.length; x++) {
		 somestring += `<tr>
			<td>${updatedArr[x][0]}</td>
			<td>${updatedArr[x][1]}</td>
		</tr>`
	}
	
	tableData.innerHTML += `<tr>
								<td class="text-capitalize">${name}</td>
								<td class="text-capitalize" style="${class_type === `physical` ? `color:#edff00;`: `${class_type !== `special` ? `color:white;`:`color:lightgreen;`}`}">${class_type}</td>
								<td><a href="#" data-bs-toggle="modal" data-bs-target="#${name}">View Pokemons</a></td>
							</tr>`;
	
		modalHolder.innerHTML += `	
		<div class="modal fade" id="${name}" tabindex="-1" aria-hidden="true">
		  <div class="modal-dialog modal-dialog-scrollable">
		    <div class="modal-content">
		      <div class="modal-header text-center">
		        <h5 class="modal-title text-capitalize w-100">${name}</h5>
		        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
		      </div>
		      <div class="modal-body text-capitalize">
				<form class="form-floating">
				<input class="form-control" type="text" id="pokiInput" onkeyup="searchValue()" placeholder="Search Pokemons ...">
				<label for="pokiInput">Search Pokemon ❤️</label>
				</form>
				<table id="poki-table" class="table" style="margin-left:auto;margin-right:auto;">
					${namesArr.length !== 0 ? `${somestring}`
					:`No Poki's Found :(`}
				</table>
		      
		      </div>
		    </div>
		  </div>
		</div>`;			
}

pokemon_types();

const searchValue = () => {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("pokiInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("poki-table");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }       
  }
}
