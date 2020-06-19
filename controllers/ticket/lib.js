const Ticket = require('../../schema/schemaTicket.js');
const User = require('../../schema/schemaUser.js');
const mongoose = require('mongoose');
function create(req, res) {
console.log(req.body.responsible)
	if (!req.body.title || !req.body.description  || !req.body.priority || !req.user.id) {
		res.status(400).json({
			"text": "Requête invalide"
		})
	} else {
		let responsible = mongoose.Types.ObjectId(req.body.responsible) || null
		var ticket = {
			title: req.body.title,
			description: req.body.description,
			responsible: req.body.responsible || null,
			priority: req.body.priority,
			creator:mongoose.Types.ObjectId(req.user.id) ,
		}

		var _t = new Ticket(ticket);
		_t.save(function (err, ticket) {
			if (err) {
				console.log(err)
				res.status(500).json({
					"text": "Erreur interne"
				})
			} else {
				res.redirect(`${ticket.getId()}`);
			}
		})
	}
}

function createForm(req, res) {

	var findUsers = new Promise(function (resolve, reject) {
		User.find( function (err, result) {
			if (err) {
				reject(500);
			} else {
				if (result) {
					resolve(result)
				} else {
					reject(200)
				}
			}
		}).populate("creator","email")
	})

	findUsers.then(function (users) {
		res.status(200).render('ticket/create', {users,title: 'Créer ticket',admin:req.user.isAdmin || false});
		}, function (error) {
		switch (error) {
			case 500:
				res.status(500).json({
					"text": "Erreur interne"
				})
				break;
			case 200:
				res.status(200).json({
					"text": "Le ticket n'existe pas"
				})
				break;
			default:
				res.status(500).json({
					"text": "Erreur interne"
				})
		}
	})
}

function show(req, res) {
	if (!req.params.id) {
		res.status(400).json({
			"text": "Requête invalide"
		})
	} else {
		var findTicket = new Promise(function (resolve, reject) {
			Ticket.findById(req.params.id, function (err, result) {
				if (err) {
					reject(500);
				} else {
					if (result) {
						resolve(result)
					} else {
						reject(200)
					}
				}
			}).populate("creator","email").populate("comments.creator","email")
		})

		findTicket.then(function (ticket) {
			res.status(200).render('ticket/show', {title: `Ticket n°${ticket._id}`, ticket,admin:req.user.isAdmin || false});
		}, function (error) {
			switch (error) {
				case 500:
					res.status(500).json({
						"text": "Erreur interne"
					})
					break;
				case 200:
					res.status(200).json({
						"text": "Le ticket n'existe pas"
					})
					break;
				default:
					res.status(500).json({
						"text": "Erreur interne"
					})
			}
		})
	}
}

function edit(req, res) {
	if (!req.params.id) {
		res.status(400).json({
			"text": "Requête invalide"
		})
	} else {
		var findTicket = new Promise(function (resolve, reject) {
			Ticket.findById(req.params.id, function (err, result) {
				if (err) {
					reject(500);
				} else {
					if (result) {
						resolve(result)
					} else {
						reject(200)
					}
				}
			}).populate("responsible","email")
		})
		var findUsers = new Promise(function (resolve, reject) {
			User.find( function (err, result) {
				if (err) {
					reject(500);
				} else {
					if (result) {
						resolve(result)
					} else {
						reject(200)
					}
				}
			})
		})
		findTicket.then(function (ticket) {
			findUsers.then(function (users) {
				res.status(200).render('ticket/edit', {users,title: `Modifier ticket n°${ticket._id}`, ticket,admin:req.user.isAdmin || false});

			}, function (error) {
				switch (error) {
					case 500:
						res.status(500).json({
							"text": "Erreur interne"
						})
						break;
					case 200:
						res.status(200).json({
							"text": "Le ticket n'existe pas"
						})
						break;
					default:
						res.status(500).json({
							"text": "Erreur interne"
						})
				}
			})

			// End here
		}, function (error) {
			switch (error) {
				case 500:
					res.status(500).json({
						"text": "Erreur interne"
					})
					break;
				case 200:
					res.status(200).json({
						"text": "Le ticket n'existe pas"
					})
					break;
				default:
					res.status(500).json({
						"text": "Erreur interne"
					})
			}
		})
	}
}

function update(req, res) {
	if (!req.params.id || !req.body.description || !req.body.responsible || !req.body.priority) {
		res.status(400).json({
			"text": "Requête invalide"
		})
	} else {
		var findTicket = new Promise(function (resolve, reject) {
			req.body.completed = typeof req.body.completed !== 'undefined' ? true : false;

			Ticket.findByIdAndUpdate(req.params.id, req.body, function (err, result) {
				if (err) {
					reject(500);
				} else {
					if (result) {
						resolve(result)
					} else {
						reject(200)
					}
				}
			})
		})

		findTicket.then(function (ticket) {
			res.redirect(`../${ticket.getId()}`);
		}, function (error) {
			switch (error) {
				case 500:
					res.status(500).json({
						"text": "Erreur interne"
					})
					break;
				case 200:
					res.status(200).json({
						"text": "Le ticket n'existe pas"
					})
					break;
				default:
					res.status(500).json({
						"text": "Erreur interne"
					})
			}
		})
	}
}

function list(req, res) {
	var findTicket = new Promise(function (resolve, reject) {
		Ticket.find({}, function (err, tickets) {
			if (err) {
				reject(500);
			} else {
				if (tickets) {
					resolve(tickets)
				} else {
					reject(200)
				}
			}
		}).populate("creator","email").populate('responsible',"email")
	})

	findTicket.then(function (tickets) {

		res.status(200).render('ticket/index', {title: 'Liste des tickets', tickets,admin:req.user.isAdmin ,user:req.user });
	}, function (error) {
		switch (error) {
			case 500:
				res.status(500).json({
					"text": "Erreur interne"
				})
				break;
			case 200:
				res.status(200).json({
					"text": "Il n'y a pas encore de ticket"
				})
				break;
			default:
				res.status(500).json({
					"text": "Erreur interne"
				})
		}
	})
}

function addComment(req,res){
	if (!req.body.ticketId || !req.body.comment || !req.user.id) {
		res.status(400).json({
			"text": "Requête invalide"
		})
	} else {
		var findTicket = new Promise(function (resolve, reject) {

			Ticket.findOne({_id:req.body.ticketId}, function (err, result) {

				if (err) {
					reject(500);
				} else {
					if (result) {

						resolve(result)
					} else {
						reject(200)
					}
				}
			})

		})

		findTicket.then(function (ticket) {
			ticket.comments.push({comment:req.body.comment,creator:req.user.id})
			ticket.save()
			res.redirect(`/ticket/${ticket.getId()}`);
		}, function (error) {
			switch (error) {
				case 500:
					res.status(500).json({
						"text": "Erreur interne"
					})
					break;
				case 200:
					res.status(200).json({
						"text": "Le ticket n'existe pas"
					})
					break;
				default:
					res.status(500).json({
						"text": "Erreur interne"
					})
			}
		})
	}
}
exports.create = create;
exports.createForm = createForm;
exports.show = show;
exports.edit = edit;
exports.update = update;
exports.list = list;
exports.addComment = addComment;