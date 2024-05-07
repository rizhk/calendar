// function isCyclic(V, adj) {
//   // code here

//   const visited = [];
//   let cyclic = 0;
//   const marked = Array(V).fill(false);

//   return dfs(0);

//   function dfs(node)
//   {
//       const marked = Array(V).fill(false);
//       const visited = [];
//       const stack = [];
//       stack.push(node);

//       while(stack> 0) {
//           let nodeToVisit = stack.pop();
//           visited.push(nodeToVisit);
//           marked[nodeToVisit] = true;
//           const neighbours = adj[nodeToVisit];
//           if(neighbours) {
//               for(const neighbour of neighbours) {
//                   if(!marked[neighbour]) {
//                       stack.push(neighbour);
//                   } else {
//                       return 1
//                   }

//               }
//           }
//       }
//   }

// }

// const V = 5 , adj = [[2,3,1] , [0], [0,4], [0], [2]]

// isCyclic(V, adj);

// function dfsOfGraph(V, adj) {
//   const visited = Array(V).fill(false); // Initialize visited array
//   const result = []; // Store the DFS traversal result

//   function visit(node) {
//       visited[node] = true; // Mark the current node as visited
//       result.push(node); // Add the current node to the result

//       const neighbours = adj[node];
//       if (neighbours) {
//           for (let neighbour of neighbours) {
//               if (!visited[neighbour]) {
//                   visit(neighbour); // Recursively visit unvisited neighbours
//               }
//           }
//       }
//   }

//   // Start DFS from node 0
//   visit(0);

//   return result;
// }

const V = 5,
  adj = [[2, 3, 1], [0], [0, 4], [0], [2, 3]];

//dfsOfGraph(V, adj);
// dict = ['baa', 'abcd', 'abca', 'cab', 'cada'];
// const N = 5;
// const K = 4;
// findOrder(dict, N, K);

// function  findOrder(dict, N, K) {
//   const adj = new Array(K).fill(null).map(() => []);
//   const visited = new Array(K).fill(false);
//   const marked = new Array(K).fill(false);
//   let cyclic = false;

//   for (let i = 0; i < K - 1; i++) {
//     const word1 = dict[i];
//     const word2 = dict[i + 1];

//     let j = 0;
//     while (j < word1.length && j < word2.length) {
//       if (word1[j] !== word2[j]) {
//         addEdge(adj, word1[j], word2[j]);
//         break;
//       }
//       j++;
//     }
//   }

//   if (isCyclic(adj, K)) {
//     return '';
//   } else {
//     return topologicalSort(adj, K);
//   }

//   function addEdge(adj, u, v) {
//     adj[u.charCodeAt(0) - 'a'.charCodeAt(0)].push(v.charCodeAt(0) - 'a'.charCodeAt(0));

//   }

// function isCyclic(adj, K) {
//     const visited = new Array(K).fill(false);
//     const marked = new Array(K).fill(false);

//     function dfs(i) {
//         visited[i] = true;
//         marked[i] = true;

//         const neighbours = adj[i];
//         if (neighbours) {
//             for (const neighbour of neighbours) {
//                 if (!visited[neighbour]) {
//                     if (dfs(neighbour)) {
//                         return true;
//                     }
//                 } else if (marked[neighbour]) {
//                     return true; // Cycle detected
//                 }
//             }
//         }

//         marked[i] = false;
//         return false;
//     }

//     for (let i = 0; i < K; i++) {
//         if (!visited[i]) {
//             if (dfs(i)) {
//                 return true; // Cycle detected
//             }
//         }
//     }
//     return false; // No cycle found
// }

//   function topologicalSort(adj, V) {
//     const st = [];
//     const visited = new Array(V).fill(false);

//     for (let i = 0; i < V; i++) {
//       if (!visited[i]) {
//         topologicalSortUtil(i, visited, st);
//       }
//     }

//     let res = '';
//     while (st.length > 0) {
//       res += String.fromCharCode(st.pop() + 'a'.charCodeAt(0));
//     }
//     console.log(res);
//     return res;
//   }

//   function topologicalSortUtil(u, visited, st) {
//     visited[u] = true;
//     const neighbours = adj[u];
//     if (neighbours) {
//       for (const v of neighbours) {
//         if (!visited[v]) {
//           topologicalSortUtil(v, visited, st);
//         }
//       }
//     }
//     st.push(u);
//   }
// }

// topoSort(V, adj);

// function topoSort(V, adj) {
//   const topo = [];
//   const indegree = new Array(V).fill(0);
//   for (let i = 0; i < V; i++) {
//     for (const j of adj[i]) {
//       indegree[j]++;
//     }
//   }
//   const queue = [];
//   for (let i = 0; i < indegree.length; i++) {
//     if (indegree[i] === 0) queue.push(i);
//   }

//   while (queue.length) {
//     const front = queue.shift();
//     topo.push(front);
//     for (const i of adj[front]) {
//       indegree[i]--;
//       if (indegree[i] === 0) queue.push(i);
//     }
//   }

//   return topo;
// }

// const v = 6, e = 5;

// const arr = [
//   [0 ,3 ,9 ],
//   [0 ,4 ,2],
//   [0 ,5 ,2],
//   [1 ,3 ,5],
//   [2 ,3 ,10]
// ];
// spanningTree(arr, v, e);
// function spanningTree(arr, v, e) {
//   // code here
//   const parent = new Array(v).fill(0).map((_, index) => index);
  
//   arr.sort((a,b) => {return a[2] - b [2]});
  
//   let minCost = 0;
  
  
//   for(let i = 0; i < e; i++) {
//     console.log(arr[i]);
//       let u = findParent(arr[i][0]);
//       let v = findParent(arr[i][1]);
//       let wt = arr[i][2];
      
//       if(u !== v) {
//            union(u,v, wt);
//            minCost += parseInt(wt);
//       }
//   }
  
//   return minCost;
//   // sort edges with weights
//   // set parent and rank to 0
//   // 
  
//   function findParent(i) {
//       if(parent[i] == i) {
//           return i;
//       } else {
//           parent[i] = findParent(parent[i]);
//           return parent[i];
//       }
//   }
  
//   function union(u,v, wt) {
//       const rootU = findParent(u);
//       const rootV = findParent(v);
//       parent[rootV] = rootU;
      
//   }
// }

// function subsets(nums) {
//   const result = [];
  
//   function backtrack(start, subset) {
//       result.push([...subset]); // Add a copy of the current subset to the result
      
//       // Explore all possible options for the current position
//       for (let i = start; i < nums.length; i++) {
//           subset.push(nums[i]); // Choose the current element
//           backtrack(i + 1, subset); // Recur with the next element
//           console.log(subset);
//           subset.pop(); // Backtrack by removing the current element
//       }
//   }
  
//   backtrack(0, []); // Start backtrack from index 0 with an empty subset
//   return result;
// }

// // Example usage:
// const nums = [1, 2, 3];
// subsets(nums);



// function reverse(str) {
//  if(str.length === 1) {
//   return str;
//  } else {
//     let k = str.length - 1;
//     return str[k] + reverse(str.substr(0, k));
//  }
// }
 
//  console.log(reverse('hello'));

// function sumArray(arr)
// {
//     if (arr.length === 0) {
//       return 0
//     }
//     let n = arr.length -1;
//     return arr[n] + sumArray(arr.slice(0,-1));
// }

// console.log(sumArray([1,2,3,4,5]));

function findDistinctPalindromicSubstrings(str) {
  const n = str.length;
  const dp = Array(n).fill(0).map(() => Array(n).fill(false));
  console.log(dp);
  const result = new Set();

  for (let gap = 0; gap < n; gap++) {
      for (let i = 0, j = gap; j < n; i++, j++) {
          if (gap === 0) {
              dp[i][j] = true; // Single characters are palindromes
          } else if (gap === 1) {
              dp[i][j] = (str[i] === str[j]); // Two characters are palindromes if they are the same
          } else {
              dp[i][j] = (str[i] === str[j] && dp[i + 1][j - 1]); // Check if the substring is a palindrome
          }

          if (dp[i][j]) {
              result.add(str.substring(i, j + 1));
          }
      }
  }

  return Array.from(result);
}

// Main function
const str = "bbaababa";
const palindromicSubstrings = findDistinctPalindromicSubstrings(str);

console.log("Number of distinct palindromic substrings are: " + palindromicSubstrings.length);
console.log("Distinct palindromic substrings:");
palindromicSubstrings.forEach(substring => {
  console.log(substring);
});