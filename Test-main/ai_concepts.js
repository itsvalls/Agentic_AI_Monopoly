// Lightweight AI concepts and interactive demos integrated with Monopoly UI.
// No external ML training, only classical AI topics from the user's list.

(function(){
	function createTopicList() {
		var topics = [
			{title: 'Definitions of AI', text: 'AI studies agents that perceive and act. Goals include rational behavior and intelligent decision-making.'},
			{title: 'Applications of AI', text: 'Games, search, planning, diagnosis, recommendation, robotics, NLP, perception.'},
			{title: 'Modeling, Inference, Learning', text: 'Modeling represents the world, inference derives conclusions, learning improves performance from data/experience.'},
			{title: 'Machine Learning as a subfield of AI', text: 'ML focuses on algorithms that learn from data; here we focus on classical search and logic, not training.'},
			{title: 'Intelligent agents & rationality', text: 'An agent maps percepts to actions to maximize expected utility. Monopoly AI is a simple reflex/heuristic agent.'},
			{title: 'Task environments', text: 'Properties: observable, deterministic, episodic, static, discrete, single/multi-agent. Monopoly is partially observable, stochastic dice, sequential, dynamic, multi-agent, discrete.'},
			{title: 'Search: uninformed vs informed', text: 'Uninformed: BFS, DFS, Uniform Cost. Informed: Greedy Best-First, A* with heuristic.'},
			{title: 'Local search & hill climbing', text: 'Hill climbing optimizes by local moves; risks: local maxima, plateau, ridges. Restart or stochastic variants help.'},
			{title: 'Adversarial search', text: 'Two-player zero-sum games use minimax and alpha-beta pruning for optimal decisions.'},
			{title: 'Logic & inference', text: 'Propositional/first-order logic, forward/backward chaining, resolution. CSPs solved via backtracking, propagation, heuristics.'},
			{title: 'Learning types', text: 'Supervised (classification, decision trees), unsupervised (k-means), reinforcement learning (not implemented here).'}
		];

		var container = document.getElementById('ai-topics');
		if (!container) return;
		container.innerHTML = '';
		topics.forEach(function(t){
			var d = document.createElement('div');
			d.className = 'ai-topic';
			d.innerHTML = '<b>' + t.title + '</b>: ' + t.text;
			container.appendChild(d);
		});
	}

	// Small search demos on a tiny graph inspired by board navigation.
	function buildGraph() {
		// Nodes represent a subset of board indices; edges are moves.
		var nodes = [0, 1, 2, 3, 4, 5, 6];
		var edges = {
			0: [1, 2],
			1: [2, 3],
			2: [3, 4],
			3: [4, 5],
			4: [5, 6],
			5: [6],
			6: []
		};
		var cost = function(a, b){ return 1; };
		var heuristic = function(n, goal){ return Math.max(0, goal - n); };
		return {nodes:nodes, edges:edges, cost:cost, heuristic:heuristic};
	}

	function bfs(graph, start, goal){
		var q = [[start]];
		var visited = new Set([start]);
		while (q.length){
			var path = q.shift();
			var n = path[path.length-1];
			if (n === goal) return path;
			(graph.edges[n]||[]).forEach(function(nb){
				if (!visited.has(nb)){
					visited.add(nb);
					q.push(path.concat([nb]));
				}
			});
		}
		return null;
	}

	function dfs(graph, start, goal){
		var stack = [[start]];
		var visited = new Set();
		while (stack.length){
			var path = stack.pop();
			var n = path[path.length-1];
			if (n === goal) return path;
			if (visited.has(n)) continue;
			visited.add(n);
			(graph.edges[n]||[]).slice().reverse().forEach(function(nb){
				stack.push(path.concat([nb]));
			});
		}
		return null;
	}

	function ucs(graph, start, goal){
		var pq = [[0, [start]]];
		var best = new Map([[start, 0]]);
		while (pq.length){
			pq.sort(function(a,b){return a[0]-b[0];});
			var item = pq.shift();
			var g = item[0];
			var path = item[1];
			var n = path[path.length-1];
			if (n === goal) return path;
			(graph.edges[n]||[]).forEach(function(nb){
				var ng = g + graph.cost(n, nb);
				if (!best.has(nb) || ng < best.get(nb)){
					best.set(nb, ng);
					pq.push([ng, path.concat([nb])]);
				}
			});
		}
		return null;
	}

	function greedy(graph, start, goal){
		var pq = [[graph.heuristic(start, goal), [start]]];
		var visited = new Set();
		while (pq.length){
			pq.sort(function(a,b){return a[0]-b[0];});
			var item = pq.shift();
			var path = item[1];
			var n = path[path.length-1];
			if (n === goal) return path;
			if (visited.has(n)) continue;
			visited.add(n);
			(graph.edges[n]||[]).forEach(function(nb){
				pq.push([graph.heuristic(nb, goal), path.concat([nb])]);
			});
		}
		return null;
	}

	function astar(graph, start, goal){
		var pq = [[graph.heuristic(start, goal), 0, [start]]];
		var best = new Map([[start, 0]]);
		while (pq.length){
			pq.sort(function(a,b){return a[0]-b[0];});
			var item = pq.shift();
			var f = item[0], g = item[1], path = item[2];
			var n = path[path.length-1];
			if (n === goal) return path;
			(graph.edges[n]||[]).forEach(function(nb){
				var ng = g + graph.cost(n, nb);
				if (!best.has(nb) || ng < best.get(nb)){
					best.set(nb, ng);
					var nf = ng + graph.heuristic(nb, goal);
					pq.push([nf, ng, path.concat([nb])]);
				}
			});
		}
		return null;
	}

	function minimax(depth, maximizing, evalFn){
		if (depth === 0) return evalFn();
		if (maximizing){
			var best = -Infinity;
			for (var i=0;i<2;i++){
				best = Math.max(best, minimax(depth-1, false, evalFn));
			}
			return best;
		} else {
			var worst = Infinity;
			for (var j=0;j<2;j++){
				worst = Math.min(worst, minimax(depth-1, true, evalFn));
			}
			return worst;
		}
	}

	function alphabeta(depth, alpha, beta, maximizing, evalFn){
		if (depth === 0) return evalFn();
		if (maximizing){
			var v = -Infinity;
			for (var i=0;i<2;i++){
				v = Math.max(v, alphabeta(depth-1, alpha, beta, false, evalFn));
				alpha = Math.max(alpha, v);
				if (beta <= alpha) break;
			}
			return v;
		} else {
			var w = Infinity;
			for (var j=0;j<2;j++){
				w = Math.min(w, alphabeta(depth-1, alpha, beta, true, evalFn));
				beta = Math.min(beta, w);
				if (beta <= alpha) break;
			}
			return w;
		}
	}

	function renderDemos(){
		var container = document.getElementById('ai-demos');
		if (!container) return;
    var html = '';
    html += '<div style="margin-top:0px;"><b>Monopoly AI Demos</b></div>';
    html += '<div style="font-size: 12px; color:#374151;">This panel focuses on techniques relevant to gameplay.</div>';

    html += '<div style="margin-top:12px;"><b>CSP: Even Building on a Color Group</b></div>';
    html += '<div class="ai-demo-controls">Houses to add <input id="ai-csp-houses" value="3" size="2"/> ';
    html += '<button id="ai-run-csp">Distribute Evenly</button></div>';
    html += '<div id="ai-csp-output" style="white-space: pre-wrap;"></div>';
    
    html += '<div style="margin-top:12px;"><b>Rule-based Inference (Forward/Backward chaining)</b></div>';
    html += '<div class="ai-demo-controls">Cash $<input id="ai-rules-cash" value="300" size="4"/>  Sets owned <input id="ai-rules-sets" value="1" size="2"/>  Debt $<input id="ai-rules-debt" value="0" size="4"/> ';
    html += '<button id="ai-run-forward">Forward Chain</button> <button id="ai-run-backward">Backward Chain</button></div>';
    html += '<div id="ai-rules-output" style="white-space: pre-wrap;"></div>';

    html += '<div style="margin-top:12px;"><b>Cryptarithmetic (CSP + Backtracking)</b></div>';
    html += '<div class="ai-demo-controls">Solve SEND + MORE = MONEY <button id="ai-run-crypto">Solve</button></div>';
    html += '<div id="ai-crypto-output" style="white-space: pre-wrap;"></div>';

    html += '<div style="margin-top:12px;"><b>Cash Target Planner (Rules + CSP Backtracking)</b></div>';
    html += '<div class="ai-demo-controls">Target cash $<input id="ai-plan-target" value="200" size="4"/> ';
    html += '<button id="ai-run-plan">Plan Actions</button></div>';
    html += '<div id="ai-plan-output" style="white-space: pre-wrap;"></div>';
		container.innerHTML = html;

    // Rule-based inference demo
    function forwardChain(facts){
        // Simple rules relevant to Monopoly planning
        // R1: IF debt>0 AND cash<debt THEN recommend 'Mortgage low-yield properties'
        // R2: IF setsOwned>0 AND cash>houseprice THEN recommend 'Consider even building'
        // R3: IF cash<100 THEN recommend 'Delay buying; preserve liquidity'
        var recs = [];
        if (facts.debt > 0 && facts.cash < facts.debt) recs.push('Mortgage low-yield properties to cover debt');
        if (facts.sets > 0 && facts.cash > 100) recs.push('Consider even building on owned color sets');
        if (facts.cash < 100) recs.push('Preserve liquidity; avoid new purchases');
        if (!recs.length) recs.push('No action suggested');
        return recs;
    }
    function backwardChain(goal, facts){
        // Goal: stay solvent (cash >= 0) and improve income
        // Justify actions by working backwards from goal
        var steps = [];
        if (goal === 'stay_solvent'){
            if (facts.debt > 0 && facts.cash < facts.debt){
                steps.push('To stay solvent: raise cash → mortgage low-yield or trade');
            } else {
                steps.push('Already solvent: no urgent action');
            }
        } else if (goal === 'increase_income'){
            if (facts.sets > 0 && facts.cash > 100){
                steps.push('Build evenly on a color group to raise rents');
            } else {
                steps.push('Acquire missing properties via trades before building');
            }
        }
        return steps;
    }
    document.getElementById('ai-run-forward').onclick = function(){
        var facts = {
            cash: Math.max(0, parseInt(document.getElementById('ai-rules-cash').value, 10) || 0),
            sets: Math.max(0, parseInt(document.getElementById('ai-rules-sets').value, 10) || 0),
            debt: Math.max(0, parseInt(document.getElementById('ai-rules-debt').value, 10) || 0)
        };
        var recs = forwardChain(facts);
        document.getElementById('ai-rules-output').textContent = recs.join('\n');
    };
    document.getElementById('ai-run-backward').onclick = function(){
        var facts = {
            cash: Math.max(0, parseInt(document.getElementById('ai-rules-cash').value, 10) || 0),
            sets: Math.max(0, parseInt(document.getElementById('ai-rules-sets').value, 10) || 0),
            debt: Math.max(0, parseInt(document.getElementById('ai-rules-debt').value, 10) || 0)
        };
        var steps = backwardChain('stay_solvent', facts).concat(backwardChain('increase_income', facts));
        document.getElementById('ai-rules-output').textContent = steps.join('\n');
    };

    // Cryptarithmetic solver: SEND + MORE = MONEY
    document.getElementById('ai-run-crypto').onclick = function(){
        var out = document.getElementById('ai-crypto-output');
        var letters = ['S','E','N','D','M','O','R','Y'];
        var used = Array(10).fill(false);
        var assign = {};

        function val(word){
            return word.split('').reduce(function(acc, ch){ return acc*10 + assign[ch]; }, 0);
        }
        function leadingZeroConstraint(){
            return assign['S'] !== 0 && assign['M'] !== 0;
        }
        var found = null;
        function backtrack(i){
            if (i === letters.length){
                if (!leadingZeroConstraint()) return false;
                var SEND = val('SEND');
                var MORE = val('MORE');
                var MONEY = val('MONEY');
                if (SEND + MORE === MONEY){ found = {SEND:SEND, MORE:MORE, MONEY:MONEY, map:Object.assign({}, assign)}; return true; }
                return false;
            }
            var L = letters[i];
            for (var d=0; d<=9; d++){
                if (used[d]) continue;
                assign[L] = d; used[d] = true;
                // simple pruning: partial column check (optional, keep simple for clarity)
                if (backtrack(i+1)) return true;
                used[d] = false; delete assign[L];
            }
            return false;
        }
        backtrack(0);
        if (found){
            out.textContent = 'Solution:\nSEND=' + found.SEND + '  MORE=' + found.MORE + '  MONEY=' + found.MONEY + '\nMapping: ' + JSON.stringify(found.map);
        } else {
            out.textContent = 'No solution found (unexpected).';
        }
    };

    // Cash Target Planner (Monopoly-relevant)
    document.getElementById('ai-run-plan').onclick = function(){
        var out = document.getElementById('ai-plan-output');
        if (!window.player || !window.square){ out.textContent = 'Game not ready.'; return; }
        var p = player[turn];
        var target = Math.max(0, parseInt(document.getElementById('ai-plan-target').value, 10) || 0);
        if (target === 0){ out.textContent = 'Target is 0; no actions needed.'; return; }

        // Build candidate actions respecting basic legality
        // action = {kind:'mortgage'|'sellhouse', index, gain, penalty, describe(), apply(arr), revert(arr)}
        function ownsCompleteSet(group){
            for (var i=0;i<group.length;i++){ if (square[group[i]].owner !== p.index) return false; }
            return true;
        }
        function isEvenSellLegal(idx){
            var s = square[idx];
            var grp = s.group || [];
            // Selling is legal only if this lot has strictly more houses than min in the group (enforce even-building reverse)
            var min = 10, max = -1;
            for (var i=0;i<grp.length;i++){ var g = square[grp[i]].house || 0; if (g<min) min=g; if (g>max) max=g; }
            var h = s.hotel ? 5 : (s.house||0);
            return h > min; // can sell down towards the minimum
        }

        var actions = [];
        // Mortgages (no houses/hotel, not already mortgaged)
        for (var i=0;i<40;i++){
            var s = square[i];
            if (!s || s.owner !== p.index) continue;
            if (s.groupNumber >= 3 && (s.house>0 || s.hotel>0)) continue; // cannot mortgage improved
            if (s.mortgage) continue;
            if (!s.price || s.price<=0) continue;
            var gain = Math.round(s.price*0.5);
            var strongSet = (s.groupNumber>=3) && ownsCompleteSet(s.group||[]);
            var penalty = (s.groupNumber===1||s.groupNumber===2) ? 2 : (s.groupNumber>=3 ? (strongSet?8:5) : 3);
            actions.push({
                kind:'mortgage', index:i, gain:gain, penalty:penalty,
                describe:function(){ return 'Mortgage '+square[this.index].name+' (+$'+this.gain+')'; },
                apply:function(state){ state.cash+=this.gain; state.mortgaged.push(this.index); },
                revert:function(state){ state.cash-=this.gain; state.mortgaged.pop(); }
            });
        }
        // Sell one house (or downgrade hotel to 4 houses) actions
        for (var j=0;j<40;j++){
            var s2 = square[j];
            if (!s2 || s2.owner !== p.index) continue;
            if (!(s2.groupNumber>=3)) continue;
            var houses = s2.hotel?5:(s2.house||0);
            if (houses<=0) continue;
            if (!isEvenSellLegal(j)) continue;
            var gain2 = Math.round(s2.houseprice*0.5);
            var penalty2 = 4; // moderate penalty for reducing rent
            actions.push({
                kind:'sellhouse', index:j, gain:gain2, penalty:penalty2,
                describe:function(){ return 'Sell 1 house on '+square[this.index].name+' (+$'+this.gain+')'; },
                apply:function(state){ state.cash+=this.gain; state.houses[this.index] = (state.houses[this.index]|| (square[this.index].hotel?5:(square[this.index].house||0))) - 1; },
                revert:function(state){ state.cash-=this.gain; state.houses[this.index] = (state.houses[this.index]||0) + 1; }
            });
        }

        // Forward-chaining rule filter: prefer non-strong-set mortgages before house sales
        var filtered = actions.filter(function(a){
            if (a.kind==='mortgage') return true;
            // keep house sales as fallback
            return true;
        });

        // Sort by penalty-per-dollar asc (value ordering)
        filtered.sort(function(a,b){ return (a.penalty/a.gain) - (b.penalty/b.gain); });

        // CSP backtracking with branch-and-bound on penalty
        var best = {pen: Infinity, picks: []};
        var state = {cash:0, mortgaged:[], houses:{}};
        var prefixGain = new Array(filtered.length+1);
        prefixGain[filtered.length]=0;
        for (var k=filtered.length-1;k>=0;k--) prefixGain[k]=prefixGain[k+1]+filtered[k].gain;

        function legalAfterApply(a){
            if (a.kind==='sellhouse'){
                // Re-evaluate even-building legality after sale
                var s3 = square[a.index];
                var grp = s3.group||[];
                var min=10,max=-1; for (var t=0;t<grp.length;t++){ var idx=grp[t]; var h = (state.houses[idx]!=null?state.houses[idx]:(square[idx].hotel?5:(square[idx].house||0))); if (h<min) min=h; if (h>max) max=h; }
                if ((max-min)>1) return false;
            }
            return true;
        }

        var picks = [];
        function dfs(pos, raised, pen){
            if (raised>=target){ if (pen<best.pen){ best.pen=pen; best.picks=picks.slice(); } return; }
            if (pos>=filtered.length) return;
            if (pen>=best.pen) return;
            if (raised + prefixGain[pos] < target) return; // cannot reach target

            // Try take
            var a = filtered[pos];
            picks.push(a);
            a.apply(state);
            if (legalAfterApply(a)) dfs(pos+1, raised+a.gain, pen+a.penalty);
            a.revert(state);
            picks.pop();

            // Try skip
            dfs(pos+1, raised, pen);
        }
        dfs(0,0,0);

        if (!best.picks.length){ out.textContent = 'No feasible plan found (constraints too tight or target too high).'; return; }
        var lines = ['Plan (penalty '+best.pen+') to raise at least $'+target+':'];
        var sum=0; best.picks.forEach(function(a){ lines.push('- '+a.describe()); sum+=a.gain; });
        lines.push('Total gain: $'+sum);
        out.textContent = lines.join('\n');
    };

    // CSP demo: distribute houses evenly across a color group using backtracking
    document.getElementById('ai-run-csp').onclick = function(){
        var out = document.getElementById('ai-csp-output');
        if (!window.square){ out.textContent = 'Board not ready.'; return; }

        // Pick the current player's selected property group if possible; else use a known group.
        // For demo, choose the first standard color group with groupNumber >= 3.
        var groupIdx = null;
        for (var i = 0; i < 40 && groupIdx == null; i++){
            if (square[i] && square[i].group && square[i].group.length >= 2 && square[i].groupNumber >= 3){
                groupIdx = square[i].group;
            }
        }
        if (!groupIdx){ out.textContent = 'No standard color group found for demo.'; return; }

        // Read current houses per property in the group
        var current = groupIdx.map(function(idx){ return square[idx].house || 0; });
        var N = Math.max(0, parseInt(document.getElementById('ai-csp-houses').value, 10) || 0);

        // Constraints:
        // - Even building: the max houses per lot cannot exceed the min by more than 1 at any step
        // - Upper bound: <= 4 houses (before hotel)
        function isConsistent(arr){
            var min = Math.min.apply(null, arr);
            var max = Math.max.apply(null, arr);
            return (max - min) <= 1 && arr.every(function(v){ return v >= 0 && v <= 4; });
        }

        // Backtracking to place N houses adhering to constraints
        var best = null;
        function backtrack(idx, placed, arr){
            if (placed === N){ best = arr.slice(); return true; }
            if (idx >= arr.length){ return false; }

            // Try incrementing house on each property one-by-one (round-robin style)
            for (var j = 0; j < arr.length; j++){
                arr[j]++;
                if (isConsistent(arr)){
                    if (backtrack(j, placed+1, arr)) return true;
                }
                arr[j]--;
            }
            return false;
        }

        var arr = current.slice();
        var ok = backtrack(0, 0, arr);
        if (!ok){
            out.textContent = 'No even distribution possible for adding ' + N + ' houses. (Likely at or near limits)';
            return;
        }

        // Show result mapping property names -> houses after placement
        var lines = ['Initial: ' + current.join(' , '), 'Final:   ' + best.join(' , ')];
        for (var k = 0; k < groupIdx.length; k++){
            var idx = groupIdx[k];
            lines.push(square[idx].name + ': ' + current[k] + ' → ' + best[k]);
        }
        out.textContent = lines.join('\n');
    };
	}

	function enhanceTiles(){
		// Add color band and icon for each cell immediately on load.
		for (var i = 0; i < 40; i++){
			var cell = document.getElementById('cell'+i);
			if (!cell) continue;
			var anchor = document.getElementById('cell'+i+'anchor');
			if (!anchor) { continue; }
			// Color band
			var band = document.createElement('div');
			band.className = 'color-band';
			if (window.square && square[i] && square[i].color){
				band.style.backgroundColor = square[i].color;
			}
			anchor.appendChild(band);
			// Price label
			var price = document.createElement('div');
			price.className = 'cell-price';
			if (window.square && square[i] && typeof square[i].price === 'number' && square[i].price > 0){
				price.textContent = '$' + square[i].price;
			}
			anchor.appendChild(price);
			// Icons for special tiles
			var icon = document.createElement('div');
			icon.className = 'cell-icon';
			if (i === 0){ icon.style.backgroundImage = 'url("images/arrow_icon.png")'; }
			if (i === 4 || i === 38){ icon.style.backgroundImage = 'url("images/tax_icon.png")'; }
			if (i === 20){ icon.style.backgroundImage = 'url("images/free_parking_icon.png")'; }
			if (i === 5 || i === 15 || i === 25 || i === 35){ icon.style.backgroundImage = 'url("images/train_icon.png")'; }
			if (i === 12 || i === 28){ icon.style.backgroundImage = 'url("images/electric_icon.png")'; }
			if (i === 2 || i === 17 || i === 33){ icon.style.backgroundImage = 'url("images/community_chest_icon.png")'; }
			if (i === 7 || i === 22 || i === 36){ icon.style.backgroundImage = 'url("images/chance_icon.png")'; }
			anchor.appendChild(icon);
		}
	}

	function ensureTilesReady(attempts){
		attempts = attempts || 0;
		if (document.getElementById('cell0anchor')){
			enhanceTiles();
			return;
		}
		if (attempts < 20){
			setTimeout(function(){ ensureTilesReady(attempts+1); }, 150);
		}
	}

	if (document.readyState === 'loading'){
		document.addEventListener('DOMContentLoaded', function(){
			createTopicList();
			renderDemos();
			ensureTilesReady(0);
		});
	} else {
		createTopicList();
		renderDemos();
		ensureTilesReady(0);
	}
})();


