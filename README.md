# ENDPOINTS:

[POST] /users/signUp -> Realiza el registro del usuario si los datos son correctos.

[POST] /users/login -> Devuelve un token si el user es correcto.

[GET] /reviwes -> devuelve array con todas las reviews.

[GET] /reviwes/:idReview -> recibe una id y devuelve la review de la database en caso de que exista

[POST] /reviwes/create -> recibe una review, lo crea en la BD y devuelve la review en cuestión

[PATCH] /reviwes/update/:idReview -> recibe una review, modifica en la review con la misma id que la recibida, y devuelve la review modificada

[DELETE] /reviwes/delete/:idReview -> elimina de la BD una review por id y devuelve la review eliminada

[GET] /brands -> devuelve array de brands.
